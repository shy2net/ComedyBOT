var exports = module.exports;

exports.sendActionOk = function(res) {
    res.json({ status : "ok" });
};

exports.sendBadRequest = function(res) {
    res.status(400).json({ status: "error", error: "The provided request contained invalid information"});
};

exports.sendError = function(res, err) {
    res.json({ status: "error", error: err});
};
