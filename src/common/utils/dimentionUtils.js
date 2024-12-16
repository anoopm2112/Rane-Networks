import { PixelRatio, Dimensions } from 'react-native';

function getDimension() {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;
    // Handle device orientation change by flipping width and height
    if (width > height) {
        return { width: height, height: width };
    }
    return { width, height };
}

export const DESIGN_HEIGHT_WIDTH = { HEIGHT: 640, WIDTH: 360 };
/**
 *
 * @param {*} height height of the screen
 */
export const convertHeight = height => {
    const elemHeight = typeof height === 'number' ? height : parseFloat(height);
    return PixelRatio.roundToNearestPixel(
        (getDimension().height * elemHeight) / DESIGN_HEIGHT_WIDTH.HEIGHT,
    );
};

/**
 *
 * @param {*} width width of the screen
 */
export const convertWidth = width => {
    const elemWidth = typeof width === 'number' ? width : parseFloat(width);
    return PixelRatio.roundToNearestPixel(
        (getDimension().width * elemWidth) / DESIGN_HEIGHT_WIDTH.WIDTH,
    );
};