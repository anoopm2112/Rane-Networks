import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import RenderHtml, { HTMLElementModel, HTMLContentModel } from 'react-native-render-html';
// custom imports
import { convertHeight, convertWidth } from '../common/utils/dimentionUtils';
import { COLORS } from '../common/enums/colors';
import STRINGS from '../common/strings';
import CustomIcon from '../assets/CustomIcon';
import { ROUTE_KEYS } from '../navigation/constants';
import { ArticleActions } from '../common/enums/ArticleActions';

export default function ArticleCardView(props) {
    const { onPressAction, index, item, tabname, navigation, briefData, bookmarkLoader } = props;
    const { title, snippet, category, sources, brief, bookmarked, share, liked } = item;
    const { width } = useWindowDimensions();

    const styles = StyleSheet.create({
        card: {
            backgroundColor: COLORS.grey,
            borderRadius: 8,
            borderColor: COLORS.borderline,
            borderWidth: 0.25,
            padding: tabname ? 0 : convertHeight(10),
            marginBottom: convertHeight(10)
        },
        squareBoxText: {
            color: COLORS.secondary,
            fontSize: convertHeight(9.8),
            backgroundColor: COLORS.bottomBarActive,
            padding: convertHeight(6),
            // width: convertWidth(225),
            alignSelf: 'flex-start',
            borderRadius: 4,
            fontFamily: 'Lato-Regular',
        },
        title: {
            color: COLORS.secondary,
            fontSize: convertHeight(17),
            fontFamily: 'Lato-Bold',
            paddingTop: convertHeight(5),
            textAlign: 'left',
            lineHeight: 20 * 1.5,
        },
        sourceTextContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        sourceText: {
            color: COLORS.secondary,
            fontSize: convertHeight(11.5),
            fontFamily: 'Lato-Regular',
            paddingVertical: convertHeight(5),
        },
        sourceWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            width: '85%'
        },
        iconsRowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 5,
            justifyContent: 'space-between'
        },
        iconsContainer: {
            backgroundColor: COLORS.iconBackground,
            width: convertHeight(35),
            height: convertHeight(35),
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: COLORS.iconBorder,
            // marginRight: convertWidth(7),
            justifyContent: 'center',
            alignItems: 'center'
        },
        iconRow: {
            flexDirection: 'row'
        },
        // My Saved List Design
        digestNameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 0.25,
            borderBottomColor: COLORS.borderline,
            paddingTop: convertHeight(10),
            paddingBottom: convertHeight(12),
            marginBottom: convertHeight(14),
            padding: convertHeight(10),
        },
        digestnameText: {
            fontSize: convertHeight(12),
            fontFamily: 'Lato-Bold',
            color: COLORS.secondary,
            width: convertWidth(220)
        },
        dateText: {
            fontSize: convertHeight(8),
            fontFamily: 'Lato-Regular',
            color: COLORS.secondary
        },
        mixedUAStyles: {
            color: COLORS.secondary,
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            paddingBottom: convertHeight(5),
            textAlign: 'left',
            lineHeight: 20 * 1.2,
        },
        categoryContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    });

    const tagsStyles = {
        a: {
            color: COLORS.secondary,
            textDecorationColor: COLORS.secondary
        },
    };

    const RenderActionIcon = (props) => {
        return (
            <TouchableOpacity onPress={() => {
                if (!bookmarkLoader) {
                    onPressAction(props.name, props.articleItemData);
                }
            }} style={[styles.iconsContainer, { marginRight: props.iconName === 'bookmark' ? 0 : convertWidth(7) }]}>
                {(props.iconName === 'share-alt') ?
                    <CustomIcon iconPackage={'FontAwesome5'} name={props.iconName} size={16} color={COLORS.secondary} /> :
                    (props.iconName === 'bookmark') ?
                        <CustomIcon iconPackage={'Ionicons'} name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={16} color={COLORS.secondary} /> :
                        (props.iconName === 'thumb-up-alt') ?
                            <CustomIcon iconPackage={'MaterialIcons'} name={liked === null ? 'thumb-up-off-alt' : liked ? props.iconName : 'thumb-up-off-alt'} size={16} color={COLORS.secondary} /> :
                            <CustomIcon iconPackage={'MaterialIcons'} name={liked === null ? 'thumb-down-off-alt' : liked ? 'thumb-down-off-alt' : props.iconName} size={16} color={COLORS.secondary} />
                }
            </TouchableOpacity>
        );
    };

    const modifiedSnippetContent = snippet.replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>');

    const handleLinkPress = (event, href) => {
        if (href) {
            navigation.navigate(ROUTE_KEYS.SOURCES_PAGE, { 
                digestName: title, digestLink: href, 
                digestBriefName: briefData?.digestBriefName,
                digestBriefSlug: briefData?.digestBriefSlug
            });
        }
    };

    return (
        <View key={index.toString()} style={styles.card}>
            {(tabname && brief) && <View style={styles.digestNameContainer}>
                <Text style={styles.digestnameText}>{brief?.name}</Text>
                <Text style={styles.dateText}>{brief?.date}</Text>
            </View>}
            <View style={{
                paddingHorizontal: tabname ? convertHeight(10) : 0,
                paddingBottom: tabname ? convertHeight(10) : 0,
            }}>
                <View style={styles.categoryContainer}>
                    {category && <View style={{ width: (!tabname && brief?.date) ? convertWidth(220) : '100%', }}>
                        <Text style={styles.squareBoxText}>{category?.toUpperCase()}</Text>
                    </View>}
                    {(!tabname && brief) && <Text style={styles.dateText}>{brief?.date}</Text>}
                </View>
                <View style={styles.titleContainer}>
                    {title != null && <Text style={styles.title}>{title}</Text>}
                    {(sources === null || sources?.length === 0)
                        ? null
                        : (<View style={styles.sourceTextContainer}>
                            <Text style={styles.sourceText}>{STRINGS.source} </Text>
                            <View style={styles.sourceWrapper}>
                                {sources?.map((item, index) => (
                                    <TouchableOpacity key={index} style={{ flexDirection: 'row', alignItems: 'center' }} 
                                        onPress={() => navigation.navigate(ROUTE_KEYS.SOURCES_PAGE, { 
                                            digestName: item.name, digestLink: item.link, 
                                            digestBriefName: briefData?.digestBriefName,
                                            digestBriefSlug: briefData?.digestBriefSlug,
                                            tabname: tabname
                                        })}>
                                        <Text>
                                            <Text style={[styles.sourceText, { textDecorationLine: 'underline' }]}>{item.name}</Text>
                                            {index !== sources.length - 1 ? ', ' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>)}
                    {snippet != null && <RenderHtml
                        contentWidth={width} source={{ html: modifiedSnippetContent }}
                        renderersProps={{ a: { onPress: handleLinkPress } }}
                        tagsStyles={tagsStyles}
                        baseStyle={styles.mixedUAStyles} />}
                </View>
                <View style={styles.iconsRowContainer}>
                    <View style={styles.iconRow}>
                        <RenderActionIcon iconName={'thumb-up-alt'} name={ArticleActions.upVote} articleItemData={item} />
                        <RenderActionIcon iconName={'thumb-down-alt'} name={ArticleActions.downVote} articleItemData={item} />
                        {share != null && <RenderActionIcon iconName={'share-alt'} name={ArticleActions.share} articleItemData={item} />}
                    </View>
                    {bookmarked != null && <RenderActionIcon iconName={'bookmark'} name={ArticleActions.bookmark} articleItemData={item} />}
                </View>
            </View>
        </View>
    );
}