const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidEmail = (email) => {
	if (!isNonEmptyString(email)) return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidPassword = (password) => {
	if (!isNonEmptyString(password)) return false;
	return password.trim().length >= 6;
};

const isValidVin = (vin) => {
	if (!isNonEmptyString(vin)) return false;
	const normalizedVin = vin.trim().toUpperCase();
	return /^[A-HJ-NPR-Z0-9]{17}$/.test(normalizedVin);
};

const isValidObjectId = (id) => {
	if (!isNonEmptyString(id)) return false;
	return /^[a-fA-F0-9]{24}$/.test(id.trim());
};

exports.validateRegister = (req, res, next) => {
	const { email, password } = req.body;

	if (!isValidEmail(email)) {
		return res.status(400).json({ message: 'Valid email is required' });
	}

	if (!isValidPassword(password)) {
		return res.status(400).json({ message: 'Password must be at least 6 characters' });
	}

	next();
};

exports.validateLogin = (req, res, next) => {
	const { email, password } = req.body;

	if (!isValidEmail(email)) {
		return res.status(400).json({ message: 'Valid email is required' });
	}

	if (!isValidPassword(password)) {
		return res.status(400).json({ message: 'Password must be at least 6 characters' });
	}

	next();
};

exports.validateDecodeVin = (req, res, next) => {
	const { vin } = req.body;

	if (!isValidVin(vin)) {
		return res.status(400).json({ message: 'VIN must be 17 characters' });
	}

	req.body.vin = vin.trim().toUpperCase();
	next();
};

exports.validateDeleteHistoryEntry = (req, res, next) => {
	const { id } = req.params;

	if (!isValidObjectId(id)) {
		return res.status(400).json({ message: 'Invalid history entry id' });
	}

	next();
};
