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

export async function onRequestGet({ request, env }) {
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

  const placeId = requestUrl.searchParams.get("id") || "";
  if (!/^[A-Za-z0-9_-]{5,200}$/.test(placeId)) {
    return json({ error: "Google Maps Place ID 格式錯誤。" }, 400);
  }

  let googleResponse;
  try {
    googleResponse = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "id,displayName,formattedAddress,location,googleMapsUri,attributions"
      }
    });
  } catch {
    return json({ error: "目前連不上 Google Maps，請稍後再試。" }, 502);
  }

  if (!googleResponse.ok) {
    return json({
      error: googleResponse.status === 429
        ? "Google Maps 店家資訊用量已達限制，請稍後再試。"
        : "Google Maps 店家資訊暫時無法載入。"
    }, googleResponse.status === 429 ? 429 : 502);
  }

  let place;
  try {
    place = await googleResponse.json();
  } catch {
    return json({ error: "Google Maps 回傳了無法讀取的資料。" }, 502);
  }
  if (!place.displayName?.text || !Number.isFinite(place.location?.latitude) || !Number.isFinite(place.location?.longitude)) {
    return json({ error: "Google Maps 沒有提供這家店的完整位置。" }, 404);
  }

  return json({
    place: {
      id: place.id || placeId,
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
    }
  });
}
