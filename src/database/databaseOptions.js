import { DigestSchema } from "./schemas/digestSchema";
import { 
    ArticleSchema, DateOptionSchema, DatePickerSchema, DateSliderSchema, DigetsArticleSchema, SourceSchema, 
} from "./schemas/articleSchema";
import { 
    MySavedArticleListBriefSchema, MySavedArticleSchema, MySavedBriefListSchema, 
} from "./schemas/mysavedSchema";
import { DigestDataSchema, PublicationSchema } from "./schemas/publicationSchema";
import { MyAccountBriefListSchema, MyAccountSettingsData, MyAccountUserData, MyAccountAboutusSchema } from "./schemas/myaccountSchema";

export const databaseOptions = {
    path: 'ranenetwork.realm',
    schema: [
        DigestSchema, 
        DateSliderSchema, ArticleSchema, SourceSchema, DigetsArticleSchema, DatePickerSchema, DateOptionSchema, 
        MySavedArticleSchema, MySavedArticleListBriefSchema, MySavedBriefListSchema,
        DigestDataSchema, PublicationSchema,
        MyAccountBriefListSchema, MyAccountSettingsData, MyAccountUserData, MyAccountAboutusSchema
    ],
    schemaVersion: 1
};