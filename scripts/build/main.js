var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function getSeasonCats(season) {
    return __awaiter(this, void 0, void 0, function () {
        var data, jsonData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("json/season" + season + ".json")];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, data.json()];
                case 2:
                    jsonData = _a.sent();
                    return [2 /*return*/, jsonData.map(function (item) { return __assign({}, item, { season: season }); })];
            }
        });
    });
}
function getCats() {
    return __awaiter(this, void 0, void 0, function () {
        var seasons, all, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seasons = [
                        getSeasonCats(1),
                        getSeasonCats(2),
                        getSeasonCats(3),
                        getSeasonCats(4)
                    ];
                    return [4 /*yield*/, Promise.all(seasons)];
                case 1:
                    all = _a.sent();
                    out = [];
                    all.forEach(function (arr) { return out.push.apply(out, arr); });
                    return [2 /*return*/, out];
            }
        });
    });
}
function parseSearch() {
    var out = new Map();
    var data = location.search.split("&").forEach(function (item, i) {
        if (i == 0)
            item = item.substring(1);
        var items = item.split("=");
        out.set(items[0], items[1]);
    });
    return out;
}
function getEmojiPath(cat) {
    if (cat.season == 1 && !isNaN(+cat.catid)) {
        return "emoji/season" + cat.season + "/cat-" + cat.catid + ".png";
    }
    var id = cat.catid.substring(cat.catid.length - 2);
    if (isNaN(+id)) {
        return "emoji/season" + cat.season + "/" + cat.catid + ".png";
    }
    if (/[0-9]/.test(cat.catid[cat.catid.length - 3]))
        id = cat.catid.substring(cat.catid.length - 3);
    var species = cat.catid.substring(0, cat.catid.length - id.length);
    return "emoji/season" + cat.season + "/" + species + "-" + id + ".png";
}
function generateCatNode(cat) {
    var div = document.createElement("div");
    div.classList.add("cat");
    div.innerHTML = "<img src=\"" + getEmojiPath(cat) + "\">\n    <p class=\"id\">#" + cat.id + "</p>\n    <p class=\"name\">" + cat.catname + "</p>\n    <span class=\"season season" + cat.season + "\">Season " + cat.season + "</span>";
    div.addEventListener("click", function () {
        var modal = document.querySelector("div.modal");
        modal.querySelector("content").className = "season" + cat.season;
        modal.querySelector("h1").textContent = cat.catname;
        modal.querySelector("p.id").textContent = "#" + cat.id;
        modal.querySelector("span.season").className = "season season" + cat.season;
        modal.querySelector("span.season").textContent = "Season " + cat.season;
        modal.querySelector("img").src = getEmojiPath(cat);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jul", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var collectionDate = new Date(+cat.timestamp * 1000);
        var hour = collectionDate.getHours();
        var ampm = hour > 11 ? "PM" : "AM";
        hour = (hour % 12);
        if (hour == 0)
            hour = 12;
        var minutes = collectionDate.getMinutes().toString();
        if (minutes.length == 1)
            minutes = "0" + minutes;
        var date = months[collectionDate.getMonth()] + " " + collectionDate.getDate() + " " + collectionDate.getFullYear() + ", " + hour + ":" + minutes + " " + ampm;
        modal.querySelector("h2#catCollectionDate").textContent = date;
        modal.classList.remove("hidden");
    });
    return div;
}
function generatePage() {
    return __awaiter(this, void 0, void 0, function () {
        var allCats, filterType, filterValue, queries, cats, pageTitle, catList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCats()];
                case 1:
                    allCats = _a.sent();
                    filterType = "season";
                    filterValue = "4";
                    queries = parseSearch();
                    if (queries.has("filter") && queries.has("value")) {
                        filterType = queries.get("filter");
                        filterValue = queries.get("value");
                    }
                    cats = allCats.filter(function (cat) { return cat[filterType] == filterValue; }).sort(function (c1, c2) { return +c2.timestamp - +c1.timestamp; });
                    pageTitle = "Season " + filterValue;
                    if (filterType == "username")
                        pageTitle = "User's cats";
                    document.querySelector("section.pageInfo h1").textContent = pageTitle;
                    document.querySelector("section.pageInfo h2").textContent = cats.length + " cats";
                    catList = document.querySelector(".catList");
                    cats.forEach(function (cat) {
                        catList.appendChild(generateCatNode(cat));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
generatePage();
document.querySelector("div.modal").addEventListener("click", function (e) {
    if (e.currentTarget != e.target)
        return;
    document.querySelector("div.modal").classList.add("hidden");
});
