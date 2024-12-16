export const DIGEST_PUBLICATION_SCHEMA = "DigestData";
export const PUBLICATION_LIST_SCHEMA = "Publication";

export const DigestDataSchema = {
    name: DIGEST_PUBLICATION_SCHEMA,
    properties: {
        name: "string?",
        slug: "string?",
        publication: { type: "list", objectType: PUBLICATION_LIST_SCHEMA },
        readStatus: "bool",
    },
};

export const PublicationSchema = {
    name: PUBLICATION_LIST_SCHEMA,
    properties: {
        date: "string?",
        gid: "string?",
        dateWiseReadStatus: "bool",
    },
};