const NewsItemsRepository = require('../models/newsRepository');
module.exports = 
class NewsItemsController extends require('./Controller') {
    constructor(req, res, params){
        super(req, res, params,  false /* needAuthorization */);
        this.newsItemsRepository = new NewsItemsRepository(req);
    }
    
    head() {
        this.response.JSON(null, this.newsItemsRepository.ETag);
    }
    get(id){

        //console.log("newsitems get");



        // if we have no parameter, expose the list of possible query strings
        if (this.params === null) { 
            if(!isNaN(id)) {
                this.response.JSON(this.newsItemsRepository.get(id));
            }
            else  
                this.response.JSON( this.newsItemsRepository.getAll(), 
                                    this.newsItemsRepository.ETag);
        }
        else {
            if (Object.keys(this.params).length === 0) /* ? only */{
                this.queryStringHelp();
            } else {
                this.response.JSON(this.newsItemsRepository.getAll(this.params), this.newsItemsRepository.ETag);
            }
        }
    }
    post(newsItem){  
        if (this.requestActionAuthorized()) {
            let newNewsItem = this.newsItemsRepository.add(newsItem);
            if (newNewsItem)
                this.response.created(newNewsItem);
            else
                this.response.unprocessable();
        } else 
            this.response.unAuthorized();
    }
    put(newsItem){
        if (this.requestActionAuthorized()) {
            if (this.newsItemsRepository.update(newsItem))
                this.response.ok();
            else
                this.response.unprocessable();
        } else
            this.response.unAuthorized();
    }
    remove(id){
        if (this.requestActionAuthorized()) {
            if (this.newsItemsRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
        } else
            this.response.unAuthorized();
    }
}