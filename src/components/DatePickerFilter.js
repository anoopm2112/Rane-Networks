import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
// custom imports
import { COLORS } from '../common/enums/colors';
import { convertHeight } from '../common/utils/dimentionUtils';
import CustomIcon from '../assets/CustomIcon';
import { getDateFormat } from '../common/utils/dateUtils';

export default function DatePickerFilter({ visible, onDateSelected, pickerData, closeModal }) {
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        const enabledDates = {};

        pickerData?.forEach(item => {
            const { date, selected } = item;
            const formattedDate = date;
            const marked = true;
            const dotColor = COLORS.transparent;
            const selectedColor = selected ? COLORS.notify : COLORS.transparent;
            const selectedTextColor = selected ? COLORS.secondary : COLORS.notify;

            enabledDates[formattedDate] = { marked, selected: true, dotColor, selectedColor, selectedTextColor };
        });
        setMarkedDates(enabledDates);
    }, [pickerData, visible]);

    const handleDateSelect = async ({ date, year }) => {

        const updatedMarkedDates = { ...markedDates };

        // Check if the selected date is already marked, if yes, unmark it; otherwise, mark it
        for (const key in updatedMarkedDates) {
            if (updatedMarkedDates.hasOwnProperty(key)) {
                if (key === date) {
                    updatedMarkedDates[key] = {
                        marked: true,
                        selected: true,
                        dotColor: COLORS.transparent,
                        selectedColor: COLORS.notify,
                        selectedTextColor: COLORS.secondary,
                    };
                } else {
                    updatedMarkedDates[key] = {
                        marked: true,
                        selected: true,
                        dotColor: COLORS.transparent,
                        selectedColor: COLORS.transparent,
                        selectedTextColor: COLORS.notify,
                    };
                }
            }
        }

        // Update the state with the new marked dates
        setMarkedDates(updatedMarkedDates);
        const filteredData = pickerData.find(item => item.date === date);
        const dateString = await getDateFormat(year);
        onDateSelected({ gid: filteredData.gid, year: dateString });
        closeModal();
    };


    const STYLES = StyleSheet.create({
        calendar: {
            borderWidth: 1,
            borderRadius: 4,
            borderColor: 'gray',
            backgroundColor: COLORS.grey,
            calendarBackground: COLORS.grey,
            width: convertHeight(240),
            padding: convertHeight(3)
        },
        centeredView: {
            flex: 1,
            // justifyContent: 'center',
            alignItems: 'center',
            paddingTop: convertHeight(130),
            backgroundColor: 'rgba(0,0,0,0.7)'
        },
        iconContainer: {
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: COLORS.secondary,
            height: convertHeight(20),
            width: convertHeight(20),
            borderRadius: convertHeight(20),
            justifyContent: 'center',
            alignItems: 'center'
        },
    });

    return (
        <Modal
            visible={visible} transparent={true} animationType="fade" onRequestClose={() => closeModal()}>
            <TouchableOpacity activeOpacity={0.9} style={STYLES.centeredView}
                onPressOut={(e) => {
                    // Only close modal if user clicks outside the modalView
                    if (e.target === e.currentTarget) {
                        closeModal();
                    }
                }}>
                {/* <TouchableOpacity onPress={() => onDateSelected()} style={STYLES.iconContainer}>
                    <CustomIcon iconPackage={'MaterialIcons'} name={'close'} size={convertHeight(16)} color={COLORS.primary} />
                </TouchableOpacity> */}
                <Calendar
                    onDayPress={(day) => {
                        if (markedDates[day.dateString] && markedDates[day.dateString].marked) {
                            handleDateSelect({ date: day.dateString, year: day });
                        }
                    }}
                    style={STYLES.calendar}
                    enableSwipeMonths
                    markedDates={markedDates}
                    theme={{
                        monthTextColor: COLORS.secondary,
                        arrowColor: COLORS.secondary,
                        textSectionTitleColor: COLORS.secondary,
                        dayTextColor: COLORS.searchText,
                        textInactiveColor: COLORS.searchText,
                        textDisabledColor: COLORS.searchText,
                        todayTextColor: COLORS.searchText
                    }}
                />
            </TouchableOpacity>
        </Modal>
    );
}