import React, { useState } from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';
import { Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';

import PeriodChartBB from '../dataVis/PeriodChartBB';
import FinanceChartBB from '../dataVis/FinanceChart';
import SymptomChartBB from '../dataVis/SymptomChart';

function ChartHome(props) {
  const user = props.user
  const period = user.periodTracking
  const symptom = user.symptomTracking
  const finance = user.financialTracking
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());
  const [focus, setFocus] = useState(null);
  const [choseDate, setDate] = useState(false);
  const [startProp, setStartProp] = useState(moment());
  const [endProp, setEndProp] = useState(moment());

  const defaultProps = {
    autoFocus: false,
    autoFocusEndDate: false,
    initialStartDate: null,
    initialEndDate: null,
    numberOfMonths: 2,
    startDatePlaceholderText: 'Start Date',
    endDatePlaceholderText: 'End Date',
  };

  const onDatesChange = ({ startDate, endDate }) => {
    setStart(startDate);
    setEnd(endDate);
    setStartProp(moment(startDate).subtract(1, 'day'));
    setEndProp(moment(endDate).add(1, 'day'));
  };

  const onFocusChange = (focusedInput) => {
    setFocus(focusedInput);
  };

  const onClick = () => {
    setDate(true);
  };

  return (
    <div>
      <Container maxWidth="xs">
        <h2>HOME OF CHARTS</h2>
        <DateRangePicker
          startDate={start}
          startDateId={'start date'}
          endDate={end}
          endDateId={'end date'}
          onDatesChange={onDatesChange}
          focusedInput={focus}
          onFocusChange={onFocusChange}
          {...defaultProps}
          isOutsideRange={() => false}
        />
        <Button onClick={onClick}>set</Button>
      </Container>
      <br />
      <br />
      <br />
      <br />
      <Container>
        <h4>period chart</h4>
        <br />
        {choseDate && period? <PeriodChartBB start={startProp} end={endProp} /> : ''}
        <br />
        <h4>finance chart</h4>
        <br />
        {choseDate && finance ? <FinanceChartBB start={startProp} end={endProp} /> : ''}
        <br />
        <h4>symptom chart</h4>
        <br />
        {choseDate && symptom? <SymptomChartBB start={startProp} end={endProp} /> : ''}
        <br />
        <br />
      </Container>
    </div>
  );
}

const mapState = (state) => {
  return {
    user: state.authUser,
    isLoggedIn: !!state.authUser._id,
  };
};

export default connect(mapState)(ChartHome);

