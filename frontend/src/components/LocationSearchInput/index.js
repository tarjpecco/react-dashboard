import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';
import PropTypes from 'prop-types';

class SearchBar extends React.Component {
  state = {
    address: '',
  };

  static propTypes = {
    onAddressChanged: PropTypes.func.isRequired,
  }

  handleChange = address => {
    this.setState({ address });
  };

  parseGeoAddress = (data) => {
    const final = {};
    data.address_components.forEach(item => {
      // eslint-disable-next-line no-return-assign
      item.types.map(category => (data[category] = item.long_name));
    });
    final.street = data.route;
    final.state = data.administrative_area_level_1;
    final.city = data.locality;
    final.county = data.administrative_area_level_2;
    final.country = data.country;
    final.postal_code = data.postal_code;
    return final;
  }

  handleSelect = address => {
    const { onAddressChanged } = this.props;
    this.setState({ address });
    geocodeByAddress(address)
      .then(results => this.parseGeoAddress(results[0]))
      .then((addressJSON) => onAddressChanged(addressJSON))
      .catch(error => console.log(error));
  };

  render() {
    const { address } = this.state;
    return (
	<PlacesAutocomplete
		value={address}
		onChange={this.handleChange}
		onSelect={this.handleSelect}
  >
		{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
			<div style={{ position: 'relative' }}>
				<input
					{...getInputProps({
          placeholder: 'Search Places ...',
          className: 'location-search-input form-control',
        })}
      />
				<div className={`autocomplete-dropdown-container ${suggestions.length > 0 ? 'show' : 'hide'}`}>
					{loading && <div>Loading...</div>}
					{suggestions.map(suggestion => {
          const className = suggestion.active
            ? 'suggestion-item--active'
            : 'suggestion-item';
          // inline style for demonstration purpose
          const style = suggestion.active
            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
            : { backgroundColor: '#ffffff', cursor: 'pointer' };
          return (
            // eslint-disable-next-line react/jsx-indent
            <div {...getSuggestionItemProps(suggestion, { className,style })}>
	            <span>{suggestion.description}</span>
            </div>
          );
        })}
				</div>
			</div>
    )}
	</PlacesAutocomplete>
    );
  }
};

export default SearchBar;