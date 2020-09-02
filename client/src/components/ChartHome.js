import React, { useState } from 'react';
import PeriodChart from '../dataVis/PeriodChart';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import PropTypes from 'prop-types';
import moment from 'moment';
import omit from 'lodash/omit';
import 'react-dates/lib/css/_datepicker.css';
import {Button, Container} from '@material-ui/core';

import PeriodChartBB from '../dataVis/PeriodChartBB';
import FinanceChartBB from '../dataVis/FinanceChart';
import SymptomChartBB from '../dataVis/SymptomChart';

export default function ChartHome() {
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());
  const [focus, setFocus] = useState(null);
  const [choseDate, setDate] = useState(false);
  const [startProp, setStartProp] = useState(moment())
  const [endProp, setEndProp] = useState(moment())

  const defaultProps = {
    //from example
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
    setStartProp(moment(startDate).subtract(1,"day"))
    setEndProp(moment(endDate).add(1,"day"))
  };

  const onFocusChange = (focusedInput) => {
    setFocus(focusedInput);
  };

  const onClick = () => {
    setDate(true);
    // setTimeout(setDate(false), 1000);
    // return <PeriodChart start={start} end={end} />;
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
      {choseDate ? <PeriodChartBB start={startProp} end={endProp} /> : ''}
      <br />
      <h4>finance chart</h4>
      <br />
      {choseDate ? <FinanceChartBB start={startProp} end={endProp} /> : ''}
      <br />
      <h4>symptom chart</h4>
      <br />
      {choseDate ? <SymptomChartBB start={startProp} end={endProp} /> : ''}
      <br />
      <br />
      </Container>
    </div>
  );
}
