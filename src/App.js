import './App.css';
import { useEffect, useState } from 'react';

const baseUrl = 'https://guest-list-for-react.herokuapp.com';

function Guest(props) {
  const [attending, setAttending] = useState(props.attending);

  async function updateAttending(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attending }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
    setAttending(!attending);
  }

  return (
    <li
      style={{ display: 'flex' }}
      className="bgWhite radBorderStyle"
      key={props.firstName}
      data-test-id="guest"
    >
      <input
        aria-label="attending"
        type="checkbox"
        checked={attending}
        onChange={() => {
          updateAttending(props.id).catch((error) => {
            console.error('Error:', error);
          });
        }}
      />
      <p className="textStyle">
        {props.firstName} {props.lastName}
        {/* <span> </span> */}
      </p>
      {attending ? <p>Attending</p> : <p>Not Attending</p>}
    </li>
  );
}

function App() {
  // ---Variables---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [guestsList, setGuestsList] = useState([]);
  const [remove, setRemove] = useState(false);

  // ---Functions---

  // Creates New Guest, sends to Heroku
  // https://guest-list-for-react.herokuapp.com/guests/
  async function setCreatedGuest() {
    const response = await fetch(`${baseUrl}/guests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    if (createdGuest) {
      console.log(createdGuest);
    }
  } // END of Creates New Guest

  // Delete Specific Guest
  async function handleRemove(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    setRemove(!remove);
  }

  // Delete All Guests, from Heroku Deploy
  function handleRemoveGuests() {
    guestsList.forEach((guest) => {
      handleRemove(guest.id).catch((error) => console.error(error));
    });
  }

  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(`${baseUrl}/guests/`);
      const allGuests = await response.json();
      setGuestsList(allGuests);
      setLoading(false);
    }
    getAllGuests().catch((error) => {
      console.error('Error:', error);
    });
  }, [lastName, remove]);

  return (
    <div>
      <div className="pageMargin">
        <div className="pageContentWrapper colStyle radBorderStyle radBorderStyle">
          <h2 className="titleWrapperControls radBorderStyle">
            React Guest List
          </h2>
          <div className="contentWrapperControls">
            <h2>enter guest details here</h2>
            <div className="rowWrapper">
              <div
                className="colWrapper
                inputFieldWrapper"
              >
                <label>
                  First name
                  <br />
                  <input
                    onChange={(e) => {
                      setFirstName(e.currentTarget.value);
                    }}
                    value={firstName}
                    className="inputFieldTextInput radBorderStyle"
                    placeholder="First name"
                  />
                </label>
              </div>
              <div className="colWrapper inputFieldWrapper">
                <label>
                  Last name
                  <br />
                  <input
                    onChange={(e) => {
                      setLastName(e.currentTarget.value);
                    }}
                    value={lastName}
                    className="inputFieldTextInput radBorderStyle"
                    placeholder="Last name"
                  />
                </label>
              </div>
            </div>
            <hr className="hrSolid" />
            <h2>guest details preview</h2>
            <div className="bgWhite textStyle paddingStyle radBorderStyle inputPreview">
              {firstName} {lastName}
            </div>
            <hr className="hrSolid" />
            <button
              className="radBorderStyle textStyle textWhite paddingStyle addGuest"
              onClick={() => {
                setCreatedGuest().catch((error) => console.log(error));
                setFirstName(() => '');
                setLastName(() => '');
                // getAllGuests();
              }}
            >
              Add Guest
            </button>
            <hr className="hrSolid" />
            <div className="rowWrapper">
              <button
                className="radBorderStyle textStyle textWhite paddingStyle deleteGuest"
                onClick={() => {
                  handleRemoveGuests().catch((error) => console.log(error));
                }}
              >
                Delete All Guests
              </button>
            </div>
          </div>
          <div>
            <div className="titleWrapperGuests h3Title">
              <h3>Current Guests:</h3>
            </div>
            <div className="contentWrapperGuests">
              <div>
                {loading === true ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <ul style={{ listStyle: 'none' }}>
                      {guestsList.length === 0 && <p>Please add a guest! </p>}
                      {guestsList.map((e) => {
                        return (
                          <div key={e.id + e.firstName}>
                            <Guest
                              key={e.id + e.firstName + e.lastName}
                              firstName={e.firstName}
                              lastName={e.lastName}
                              attending={e.attending}
                              id={e.id}
                            />
                            <button
                              aria-label="Remove"
                              onClick={() => {
                                handleRemove(e.id).catch((error) => {
                                  console.error('Error:', error);
                                });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
