const eBayApi = require("ebay-api");

const eBay = new eBayApi({
	appId: process.env.EBAY_CLIENT_ID,
	certId: process.env.EBAY_CLIENT_SECRET,
	sandbox: false,
	siteId: eBayApi.SiteId.EBAY_DE,
	marketplaceId: eBayApi.MarketplaceId.EBAY_DE,
	acceptLanguage: eBayApi.Locale.de_DE,
	contentLanguage: eBayApi.ContentLanguage.de_DE,
});

export default async function handler(req, res) {
	try {
		const params = {
			q: `${req.body.query}`,
			limit: 25,
			filter: `conditions:{NEW}`,
			offset: req.body.offset,
		};

		if (req.body.id) {
			params.category_ids = `${req.body.id}`;
		}

		const response = await eBay.buy.browse.search(params);

		return res.status(200).json({ status: "ok", res: response });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ status: false, res: error });
	}
}
