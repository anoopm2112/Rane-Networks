export const DATE_SLIDER_SCHEMA = "DateSlider";
export const ARTICLE_LIST_SCHEMA = "ArticleList";
export const SOURCE_LINK_SCHEMA = "SourceLink";
export const DIGEST_ARTICLE_SCHEMA = "DigetsArticleSchema";
export const DATE_OPTION_SCHEMA = "DateOption";
export const DATE_PICKER_SCHEMA = "DatePicker";

export const DateSliderSchema = {
    name: DATE_SLIDER_SCHEMA,
    properties: {
        date: 'string?',
        gid: 'string?',
    }
};

export const SourceSchema = {
    name: SOURCE_LINK_SCHEMA,
    properties: {
        name: 'string?',
        link: 'string?',
    }
};

export const ArticleSchema = {
    name: ARTICLE_LIST_SCHEMA,
    properties: {
        category: 'string?',
        title: 'string?',
        snippet: 'string?',
        liked: { type: 'bool', optional: true },
        bookmarked: { type: 'bool', optional: true },
        share: 'string?',
        // sources: { type: 'list', objectType: SOURCE_LINK_SCHEMA, default: [] }
    }
};

export const DigetsArticleSchema = {
    name: DIGEST_ARTICLE_SCHEMA,
    properties: {
        name: 'string?',
        slug: 'string?',
        gid: 'string?',
        date_option: DATE_OPTION_SCHEMA,
        article: { type: 'list', objectType: ARTICLE_LIST_SCHEMA },
        bookmarked: { type: 'bool', optional: true },
        share: 'string?',
        tailor: 'string?',
        web: 'string?',
    }
}

export const DatePickerSchema = {
    name: DATE_PICKER_SCHEMA,
    properties: {
        date: 'string?',
        gid: 'string?',
        selected: { type: 'bool', default: false },
    }
};

export const DateOptionSchema = {
    name: DATE_OPTION_SCHEMA,
    properties: {
        picker: { type: 'list', objectType: DATE_PICKER_SCHEMA },
        slider: { type: 'list', objectType: DATE_SLIDER_SCHEMA }
    },
};