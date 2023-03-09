// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const eBay = require("ebay-node-api");

let ebay = new eBay({
	clientID: "UweHorn-TikiShop-PRD-01c6fefd9-8c8c4fb7",
	clientSecret: "PRD-1c6fefd90bec-3b08-44b7-a3dd-f70e",
	env: "PRODUCTION",
	headers: {
		"X-EBAY-C-MARKETPLACE-ID": "EBAY_DE",
	},
});

export default async function handler(req, res) {
	try {
		let response = [];
		const categoryIds = req.query.categoryIds.split(",");

		for (let index = 0; index < categoryIds.length; index++) {
			const id = categoryIds[index];

			const request = await ebay.getAccessToken().then((data) => {
				return ebay.searchItems({
					categoryId: id,
					limit: `${req.query.limit}`,
					filter: `sellers:{${req.query.seller}}`,
				});
			});
			const json = JSON.parse(request);
			const items = json.itemSummaries;
			response = [...response, ...items];
		}
		res.status(200).json({ status: "ok", res: response });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: false, res: error });
	}
}
