function validateString(string) {
	const parsedAsInt = parseInt(string);

	if (string.length > 30) {
		console.log(`
        This string is too long.`);
		return false;
	} else if (isNaN(parsedAsInt) === false) {
		console.log(`
        Please enter a string, not a number.`);
		return false;
	} else {
		return true;
	}
}

function validateSalary(number) {
	const parsedAsInt = parseInt(number);

	if (isNaN(parsedAsInt) === true) {
		console.log(`
        Please enter a number.`);
		return false;
	} else {
		return true;
	}
}

module.exports = {
	validateString,
	validateSalary,
};
