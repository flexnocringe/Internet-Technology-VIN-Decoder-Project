const BASE_URL = 'https://api.auto.dev/vin';

function formatVinResponse(data) {
    return {
        vin: data?.vin ?? null,
        origin: data?.origin ?? null,
        type: data?.type ?? data?.vehicle?.type ?? null,
        make: data?.make ?? data?.vehicle?.make ?? null,
        model: data?.model ?? data?.vehicle?.model ?? null,
        manufacturer: data?.vehicle?.manufacturer ?? null,
    };
}

async function decodeVin(vin) {
    const apiKey = process.env.API_KEY;

	if (!vin || typeof vin !== 'string') {
		throw new Error('VIN is required.');
	}

	const normalizedVin = vin.trim().toUpperCase();
	const endpoint = `${BASE_URL}/${normalizedVin}?apiKey=${encodeURIComponent(apiKey)}`;

	const response = await fetch(endpoint, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
	});

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`API error ${response.status}: ${errorBody}`);
	}

	return formatVinResponse(await response.json());
}

module.exports = decodeVin;