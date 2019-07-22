const util = require("./utilities");

function curateLabel(termClass, label) {
    label = util.copByVal(label);
    if (termClass["label"] === undefined || termClass["label"] === null) {
        //create new
        if (label !== undefined) {
            if (typeof label === "string") {
                //standard -> "en"
                termClass["label"] = {
                    "en": label
                };
            } else {
                termClass["label"] = label;
            }
        } else {
            termClass["label"] = null;
        }
    } else {
        //edit
        if (label !== undefined) {
            if (typeof label === "string") {
                //standard -> "en"
                if (termClass["label"] === null) {
                    termClass["label"] = {
                        "en": label
                    };
                } else {
                    termClass["label"]["en"] = label; //overwrite value
                }
            } else {
                let langKeys = Object.keys(label);
                for (let i = 0; i < langKeys.length; i++) {
                    termClass["label"][langKeys[i]] = label[langKeys[i]];
                }
            }
        }
    }
}

function curateComment(termClass, comment) {
    comment = util.copByVal(comment);
    if (termClass["comment"] === undefined || termClass["comment"] === null) {
        //create new
        if (comment !== undefined) {
            if (typeof comment === "string") {
                //standard -> "en"
                termClass["comment"] = {
                    "en": comment
                };
            } else {
                termClass["comment"] = comment;
            }
        } else {
            termClass["comment"] = null;
        }
    } else {
        //edit
        if (comment !== undefined) {
            if (typeof comment === "string") {
                //standard -> "en"
                if (termClass["comment"] === null) {
                    termClass["comment"] = {
                        "en": comment
                    };
                } else {
                    termClass["comment"]["en"] = comment; //overwrite value
                }
            } else {
                let langKeys = Object.keys(comment);
                for (let i = 0; i < langKeys.length; i++) {
                    termClass["comment"][langKeys[i]] = comment[langKeys[i]];
                }
            }
        }
    }
}

module.exports = {
    curateLabel,
    curateComment
};