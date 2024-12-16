export const MY_ACCOUNT_BRIEF_LIST_SCHEMA = "MyAccountBriefListSchema";
export const MY_ACCOUNT_SETTINGS_DATA_SCHEMA = "MyAccountSettingsDataSchema";
export const MY_ACCOUNT_USER_DATA_SCHEMA = "MyAccountUserDataSchema";
export const MY_ACCOUNT_ABOUTUS_SCHEMA = "MyAccountAboutusSchema";

export const MyAccountBriefListSchema = {
    name: MY_ACCOUNT_BRIEF_LIST_SCHEMA,
    properties: {
        name: 'string?',
        notify: { type: 'bool', optional: true },
        show_on_wall: { type: 'bool', optional: true },
        slug: 'string?'
    }
};

export const MyAccountSettingsData = {
    name: MY_ACCOUNT_SETTINGS_DATA_SCHEMA,
    properties: {
        user: MY_ACCOUNT_USER_DATA_SCHEMA,
        about_us: MY_ACCOUNT_ABOUTUS_SCHEMA
    }
}

export const MyAccountUserData = {
    name: MY_ACCOUNT_USER_DATA_SCHEMA,
    properties: {
        email: 'string?',
        name: 'string?'
    }
}

export const MyAccountAboutusSchema = {
    name: MY_ACCOUNT_ABOUTUS_SCHEMA,
    properties: {
        email: 'string?',
        name: 'string?',
        phone: 'string?',
        website: 'string?'
    }
}