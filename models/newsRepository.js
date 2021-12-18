const Repository = require('./repository');
const ImageFilesRepository = require('./imageFilesRepository.js');
const utilities = require("../utilities");
const NewsItem = require('./news.js');

module.exports = 
class NewsItemsRepository extends Repository {
    constructor(req) {
        super('News', true);//<---?
        this.users = new Repository('Users');//
        this.req = req;
        this.setBindExtraDataMethod(this.bindUsernameAndNewsItemURL);
    }
    bindUsernameAndNewsItemURL(newsItem){

        console.log("bind");

        if(newsItem) {
            let user = this.users.get(newsItem.UserId);
            let username = "unknown";
            if (user !== null)
                username = user.Name;
            let bindedNewsItem = {...newsItem};
            bindedNewsItem["Username"] = username;
            bindedNewsItem["Date"] = utilities.secondsToDateString(newsItem["Created"]);
            if (bindedNewsItem["GUID"] != "") {
                bindedNewsItem["OriginalURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(newsItem["GUID"]);
                bindedNewsItem["ThumbnailURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getThumbnailFileURL(newsItem["GUID"]);
            } else {
                bindedNewsItem["OriginalURL"] = "";
                bindedNewsItem["ThumbnailURL"] = "";
            }
            return bindedNewsItem;
        }
        return null;
    }
    add(newsItem) {
        newsItem["Created"] = utilities.nowInSeconds();
        if (NewsItem.valid(newsItem)) {
            newsItem["GUID"] = ImageFilesRepository.storeImageData("", newsItem["ImageData"]);
            delete newsItem["ImageData"];
            return super.add(newsItem);
        }
        return null;
    }
    update(newsItem) {
        newsItem["Created"] = utilities.nowInSeconds();
        if (NewsItem.valid(newsItem)) {
            let foundNewsItem = super.get(newsItem.Id);
            if (foundNewsItem != null) {
                newsItem["GUID"] = ImageFilesRepository.storeImageData(newsItem["GUID"], newsItem["ImageData"]);
                delete newsItem["ImageData"];
                return super.update(newsItem);
            }
        }
        return false;
    }
    remove(id){
        let foundNewsItem = super.get(id);
        if (foundNewsItem) {
            ImageFilesRepository.removeImageFile(foundNewsItem["GUID"]);
            return super.remove(id);
        }
        return false;
    }
}