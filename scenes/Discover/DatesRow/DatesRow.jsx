import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box, Icon, IconButton, Typography, CircularProgress } from '@material-ui/core';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import ReactGA from 'react-ga';

import { useDesktop, useFocusedDate } from '../../../utils';
import DateCardPreview from '../../../components/DateCardPreview/DateCardPreview';
import Store from '../../../store';
import Constants from '../../../constants';

const styles = () => ({
  container: {
    margin: '12px 0',
  },
  loadingContainer: {
    textAlign: 'center',
  },
  titleBar: {
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    paddingLeft: '20px',
    fontWeight: 600,
  },
});

function DatesRow({ classes }) {
  const store = Store.useStore();
  const dateObjs = store.get('dates');
  const isDesktop = useDesktop();
  const [focusedDate, setFocusedDate] = useFocusedDate();

  const dateCards = dateObjs
    .filter(date => date.sections.some(section => section.tags.some(tag => tag.name === 'At Home')))
    .map(date => {
      return (
        <div key={date.id}>
          <div className={classes.dateContainer}>
            <DateCardPreview dateObj={date} noExpand />
          </div>
        </div>
      );
    });

  return (
    <section className={classes.container}>
      <div className={classes.titleBar}>
        <Typography variant="h6" className={classes.title}>
          Discover At Home Dates
        </Typography>
      </div>
      {dateObjs.length ? (
        <ScrollMenu
          inertiaScrolling
          inertiaScrollingSlowdown={0.5}
          alignOnResize={false}
          translate={20}
          data={dateCards}
          wheel={false}
          itemStyle={{
            paddingRight: '20px',
          }}
          arrowLeft={
            isDesktop && (
              <IconButton>
                <Icon>chevron_left</Icon>
              </IconButton>
            )
          }
          arrowRight={
            isDesktop && (
              <IconButton>
                <Icon>chevron_right</Icon>
              </IconButton>
            )
          }
          onSelect={dateId => {
            const date = dateObjs.find(dateObj => {
              return dateObj.id === parseInt(dateId, 10);
            });
            ReactGA.event({
              category: 'Interaction',
              action: 'Focus Date',
              label: date && date.name,
            });
            setFocusedDate(dateId, Constants.PAGES.SEARCH).then(() => window.scrollTo(0, 0));
          }}
        />
      ) : (
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      )}
    </section>
  );
}

export default withStyles(styles)(DatesRow);