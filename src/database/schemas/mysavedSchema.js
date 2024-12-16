export const MY_SAVED_ARTICLE_LIST_SCHEMA = "MySavedArticleList";
export const MY_SAVED_ARTICLE_SCHEMA = "MySavedArticleSchema";
export const MY_SAVED_ARTICLE_LIST_BRIEF_SCHEMA = "MySavedArticleListBriefSchema";

export const MY_SAVED_BRIEF_LIST_SCHEMA = "MySavedBriefListSchema";

//================================= ARTICLE ======================================//

// Save Article List Data
export const MySavedArticleSchema = {
    name: MY_SAVED_ARTICLE_SCHEMA,
    properties: {
        gid: 'string?',
        category: 'string?',
        title: 'string?',
        snippet: 'string?',
        liked: { type: 'bool', optional: true },
        bookmarked: { type: 'bool', optional: true },
        share: 'string?',
        brief: MY_SAVED_ARTICLE_LIST_BRIEF_SCHEMA
    }
};

export const MySavedArticleListBriefSchema = {
    name: MY_SAVED_ARTICLE_LIST_BRIEF_SCHEMA,
    properties: {
        name: 'string?',
        slug: 'string?',
        gid: 'string?',
        date: 'string?',
    }
};

//================================= BRIEF ======================================//

// Save Brief List Data
export const MySavedBriefListSchema = {
    name: MY_SAVED_BRIEF_LIST_SCHEMA,
    primaryKey: 'gid',
    properties: {
        id: 'string?',
        name: 'string?',
        slug: 'string?',
        gid: 'string?',
        date: 'string?',
        bookmarked: { type: 'bool', optional: true },
        tailor: 'string?',
        web: 'string?'
    }
};

