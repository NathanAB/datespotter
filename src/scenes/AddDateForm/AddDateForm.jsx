import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, Button, IconButton } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';

import Store from '../../store';
import Constants from '../../constants';
import * as api from '../../api';

const styles = theme => ({
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
  },
  listHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  listItem: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  noDate: {
    padding: '10px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  textInput: {
    width: '100%',
  },
  confirmButton: {
    margin: '24px 0',
  },
  deleteButton: {
    margin: '24px 0',
    marginLeft: '12px',
  },
  formTitle: {
    padding: '16px 46px 16px 24px',
  },
});

// TODO - Add validation
function AddDateForm({ classes }) {
  const store = Store.useStore();
  const checkoutDate = store.get('checkoutDate');
  const editDate = store.get('editDate');
  const [name, setName] = useState(editDate ? editDate.name : '');
  const [dateTime, setDateTime] = useState(editDate ? moment(editDate.startTime) : moment());
  const [notes, setNotes] = useState(editDate ? editDate.notes : '');
  const [isSaving, setIsSaving] = useState(false);
  let userDates = store.get('userDates');

  const confirmCheckout = async e => {
    e.preventDefault();

    // If the date already has an ID, that means it's an edit (not creation).
    const isEditing = Boolean(editDate.id);

    // Do not allow saving without a date name
    if (!name) {
      return;
    }

    setIsSaving(true);

    const newUserDate = {
      id: editDate.id,
      dateId: checkoutDate.id || editDate.dateId,
      name,
      startTime: dateTime.toISOString(),
      notes,
    };

    if (isEditing) {
      await api.updateUserDate(newUserDate);
    } else {
      await api.createUserDate(newUserDate);
    }

    if (editDate) {
      userDates = userDates.filter(date => date.id !== editDate.id);
    }

    store.set('userDates')(userDates.concat([newUserDate]));
    store.set('currentTab')(Constants.TABS.MY_DATES);
    store.set('checkoutDate')(false);
    store.set('editDate')(false);
    setIsSaving(false);
  };

  const cancelCheckout = () => {
    store.set('checkoutDate')(false);
    store.set('editDate')(false);
  };

  const deleteDate = async () => {
    const confirm = window.confirm('Are you sure you want to delete this date?');
    if (!confirm) {
      return;
    }
    setIsSaving(true);
    await api.deleteUserDate(editDate);
    userDates = userDates.filter(date => date.id !== editDate.id);
    store.set('userDates')(userDates);
    store.set('checkoutDate')(false);
    store.set('editDate')(false);
    setIsSaving(false);
  };

  const renderButtons = () => {
    if (isSaving) return 'Saving date...';
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          size="small"
          type="submit"
          className={classes.confirmButton}
        >
          {editDate ? 'Change Date' : 'Add this Date'}
        </Button>
        {editDate && (
          <Button
            onClick={deleteDate}
            color="primary"
            size="small"
            type="button"
            className={classes.deleteButton}
          >
            Delete Date
          </Button>
        )}
      </>
    );
  };

  return (
    <Dialog
      open={!!checkoutDate || !!editDate}
      onClose={cancelCheckout}
      aria-labelledby="form-dialog-title"
    >
      <IconButton aria-label="Close" className={classes.closeButton} onClick={cancelCheckout}>
        <CloseIcon />
      </IconButton>
      <DialogTitle id="form-dialog-title" className={classes.formTitle}>
        {editDate ? 'Edit date' : `Planning: ${checkoutDate.name}`}
      </DialogTitle>
      <DialogContent>
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={confirmCheckout}
        >
          <TextField
            id="date-name"
            label="Date Name"
            margin="dense"
            className={classes.textInput}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <DateTimePicker
            margin="normal"
            className={classes.textInput}
            value={dateTime}
            onChange={setDateTime}
            required
          />

          <TextField
            id="date-notes"
            label="Notes"
            margin="dense"
            className={classes.textInput}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          {renderButtons()}
        </form>
      </DialogContent>
    </Dialog>
  );
}

AddDateForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddDateForm);
