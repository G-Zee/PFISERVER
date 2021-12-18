module.exports = 
    class NewsItem {
        constructor(title, text, created, userId, GUID)
        {
            this.Id = 0;
            this.Title = title !== undefined ? title : "";
            this.Text = text !== undefined ? text : "";
            this.Created = created !== undefined ? created : 0;
            this.userId = userId !== undefined ? userId : 0;
            this.GUID = GUID !== undefined ? GUID : "";
        }

        static valid(instance) {
            const Validator = new require('./validator');
            let validator = new Validator();

            validator.addField('Id','integer');
            validator.addField('Title','string');

            validator.addField('UserId', 'integer');
            validator.addField('Text','string');
            validator.addField('Created','integer');

            return validator.test(instance);
        }
    }