// Serviço para comunicação com a API SkyHawk
export interface TimeSeriesData {
	success: boolean;
	data: {
		timeline: string[];
		values: number[];
		metadata: {
			collection: string;
			variable: string;
			resolution: string;
		};
	};
}

export interface TimeSeriesRequest {
	lat: number;
	lng: number;
	collection?: string;
	variable?: string;
	startDate?: string;
	endDate?: string;
}

const API_BASE_URL = "http://localhost:5000/api";

export const skyHawkService = {
	async getTimeSeries(params: TimeSeriesRequest): Promise<TimeSeriesData> {
		const response = await fetch(`${API_BASE_URL}/time-series`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				lat: params.lat,
				lng: params.lng,
				collection: params.collection || "S2-16D-2",
				variable: params.variable || "NDVI",
				startDate: params.startDate || "2024-01-01",
				endDate: params.endDate || "2024-10-06",
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	},
};
