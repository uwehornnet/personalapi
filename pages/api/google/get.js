import path from "path";
import { promises as fs } from "fs";
import { google } from "googleapis";

export default async function handler(req, res) {
	try {
		const auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
				client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
				private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
			},
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});
		const authClientObject = await auth.getClient();
		const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

		const response = await googleSheetsInstance.spreadsheets.values.get({
			auth,
			spreadsheetId: process.env.SHEET_ID,
			range: "Tabellenblatt1",
		});

		const rows = response.data.values;

		const keys = rows[0];
		const sheetData = [];
		rows.forEach((arr, index) => {
			if (index > 0 && arr.length) {
				const row = {};
				arr.forEach((value, i) => {
					row[keys[i]] = value;
				});
				sheetData.push(row);
			}
		});
		res.status(200).json({ status: "ok", res: sheetData });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: false, res: error });
	}
}
