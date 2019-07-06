import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Store from '../../store';
import DatesList from '../Discover/DatesList/DatesList';
import UserDateCard from '../../components/UserDateCard/UserDateCard';

const styles = {};

function MyDates({}) {
  const store = Store.useStore();
  const userDates = store.get('userDates');

  function renderMyDates() {
    const dateCards = userDates.map(userDate => <UserDateCard userDate={userDate} />);
    // const dateCards = [<UserDateCard />];
    return <DatesList>{dateCards}</DatesList>;
  }

  return <>{renderMyDates()}</>;
}

export default withStyles(styles)(MyDates);
