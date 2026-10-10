function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  const requestUrl = new URL(request.url);
  if (origin && origin !== requestUrl.origin) {
    return json({ error: "不允許的請求來源。" }, 403);
  }
  if (!env.GOOGLE_MAPS_API_KEY) {
    return json({
      code: "API_KEY_MISSING",
      error: "Google Maps Places API 尚未設定。"
    }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "搜尋內容格式錯誤。" }, 400);
  }

  const query = typeof body.query === "string" ? body.query.trim().slice(0, 120) : "";
  const area = typeof body.area === "string" ? body.area.trim().slice(0, 120) : "";
  if (!query) return json({ error: "請輸入店名或地址。" }, 400);

  // Only send the explicitly entered business name and locality to Google.
  // Never read or forward browser geolocation.
  const textQuery = [query, area, area ? "" : "Taiwan"].filter(Boolean).join(", ");
  let googleResponse;
  try {
    googleResponse = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.attributions"
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "zh-TW",
        regionCode: "TW",
        pageSize: 8
      })
    });
  } catch {
    return json({ error: "目前連不上 Google Maps，請稍後再試。" }, 502);
  }

  if (!googleResponse.ok) {
    return json({
      error: googleResponse.status === 429
        ? "Google Maps 搜尋用量已達限制，請稍後再試。"
        : "Google Maps 搜尋暫時無法使用，請檢查 Places API 設定與用量。"
    }, googleResponse.status === 429 ? 429 : 502);
  }

  let data;
  try {
    data = await googleResponse.json();
  } catch {
    return json({ error: "Google Maps 回傳了無法讀取的資料。" }, 502);
  }

  const places = (Array.isArray(data.places) ? data.places : [])
    .filter(place => place.id && place.displayName?.text && Number.isFinite(place.location?.latitude) && Number.isFinite(place.location?.longitude))
    .map(place => ({
      id: place.id,
      name: place.displayName.text,
      address: place.formattedAddress || "",
      lat: place.location.latitude,
      lng: place.location.longitude,
      googleMapsUri: typeof place.googleMapsUri === "string" ? place.googleMapsUri : "",
      attributions: (Array.isArray(place.attributions) ? place.attributions : [])
        .filter(item => item && typeof item.provider === "string")
        .map(item => ({
          provider: item.provider,
          providerUri: typeof item.providerUri === "string" ? item.providerUri : ""
        }))
    }));

  return json({ places });
}
