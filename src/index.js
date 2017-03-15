import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'; 
import './index.css';

class BeerStyleRow extends React.Component {
  render() {
    return <tr><th colSpan="2">{this.props.style}</th></tr>;
  }
}



class BeerRow extends React.Component {
  render() {
    var name = this.props.beer.status === 'verified' ? this.props.beer.name :
    <span style={{color: 'red'}}>
      {this.props.beer.name}
    </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.beer.ibu}</td>
      </tr>
    );
  }
}




class BeerTable extends React.Component {
  render() {
    var rows = [];
    var lastStyle = null;
    this.props.beers.forEach((beer) => {
    	// If no beers matches filter text
    	if (beer.name.indexOf(this.props.filterText) === -1 || 
    		// If beer is not verified and state is verified: true
    		(beer.status !== 'verified' && this.props.verifiedOnly)) {
    		return;
    	}
    	// Beer gets added to list if it passes logical tests above
      if (beer.style.shortName !== lastStyle) {
        rows.push(<BeerStyleRow style={beer.style.shortName} key={beer.style.shortName} />);
      }
      rows.push(<BeerRow beer={beer} key={beer.name} />);
      lastStyle = beer.style.shortName;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>IBUs</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}





class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
		this.handleVerifiedOnlyInputChange = this.handleVerifiedOnlyInputChange.bind(this);
	}

	handleFilterTextInputChange(e) {
		this.props.onFilterTextInput(e.target.value);
	}

	handleVerifiedOnlyInputChange(e) {
		this.props.onVerifiedOnlyInput(e.target.checked);
	}

  render() {
    return (
      <form>
        <input 
        	type="text"
        	placeholder="Search..."
        	value={this.props.filterText} 
        	onChange={this.handleFilterTextInputChange}
        />
        <p>
          <input 
          type="checkbox" 
          checked={this.props.verifiedOnly}
          onChange={this.handleVerifiedOnlyInputChange}
        />
	        {' '}
	        Only show verified beers
        </p>
      </form>
    );
  }
}





class FilterableBeerTable extends React.Component {
	constructor(props) {
		super(props);
		// Reflects the initial state of the application
		this.state = {
			filterText: '',
			verifiedOnly: false
		};
		this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
		this.handleVerifiedOnlyInput = this.handleVerifiedOnlyInput.bind(this);
	}

	handleFilterTextInput(filterText) {
		this.setState({
			filterText: filterText
		});
	}

	handleVerifiedOnlyInput(verifiedOnly) {
		this.setState({
			verifiedOnly: verifiedOnly
		});
	}
  render() {
    return (
      <div>
        <SearchBar 
        	filterText={this.state.filterText}
        	verifiedOnly={this.state.verifiedOnly}
        	onFilterTextInput={this.handleFilterTextInput}
        	onVerifiedOnlyInput={this.handleVerifiedOnlyInput}
        />
        <BeerTable
        	beers={this.props.beers} 
        	filterText={this.state.filterText}
        	verifiedOnly={this.state.verifiedOnly}
        />
      </div>
    );
  }
}


class FilterableBeerTableContainer extends React.Component {
	constructor() {
		super();
		this.state = { beers: [] }
	}
			//header: "Content-Type": "application/json",
	componentDidMount() {
		$.ajax({
			url: "http://api.brewerydb.com/v2/search/?key=691c2c53452dbb770c3aab03af8d3399",
			dataType: "json",
			data: {
				q: "modern times",
				type: "beer"
			},
			success: function(beers) {
				console.log(beers);
				this.setState({beers: beers.data});
			}.bind(this)
		});
	}


	render() {
		return <FilterableBeerTable beers={this.state.beers} />
	}
}



ReactDOM.render(
  <FilterableBeerTableContainer />,
  document.getElementById('root')
);


