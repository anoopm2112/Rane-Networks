import { ArticleActions } from "../enums/ArticleActions";

const bottomSheetList = [
    {
        id: 1,
        name: 'Save',
        actionName: ArticleActions.save,
        iconName: 'bookmark'
    },
    {
        id: 2,
        name: 'Share',
        actionName: ArticleActions.share,
        iconName: 'share-alt'
    },
    {
        id: 3,
        name: 'Upgrade',
        actionName: ArticleActions.upgrade,
        iconName: 'settings'
    },
    {
        id: 4,
        name: 'View on web',
        actionName: ArticleActions.viewOnWeb,
        iconName: 'web'
    }
];

export { bottomSheetList };