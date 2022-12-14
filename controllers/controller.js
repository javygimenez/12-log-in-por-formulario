const form = (req, res) => {
	res.render('form', { name: req.session.name });
};

const home = (req, res) => {
	const { name } = req.body;
	req.session.name = name;
	res.render('form', { name: req.session.name });
}

const destroy = (req, res) => {
	try {
		req.session.destroy();
		res.render('logout');
	} catch (err) {
		res.status(500).send('Error: ', err);
	}
}

module.exports = { form, home, destroy };