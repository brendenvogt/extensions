import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { LayoutAnimation } from 'react-native';
import { bindActionCreators } from 'redux';

import { Button, Icon } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import {
  isFavoriteItem,
  isFavoritesSchema,
} from '../helpers';
import {
  saveFavorite,
  deleteFavorite,
} from '../redux';

export class Favorite extends PureComponent {
  static propTypes = {
    item: PropTypes.any.isRequired,
    saveFavorite: PropTypes.func,
    deleteFavorite: PropTypes.func,
    isFavorite: PropTypes.bool,
    navBarButton: PropTypes.bool,
    schema: PropTypes.string.isRequired,
    children: PropTypes.any,
    hasFavorites: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  toggleFavorite() {
    const { item, saveFavorite, isFavorite, deleteFavorite, schema } = this.props;

    if (isFavorite) {
      LayoutAnimation.easeInEaseOut();
      deleteFavorite(item.id, schema);
    } else {
      LayoutAnimation.easeInEaseOut();
      saveFavorite({ id: item.id, timestamp: Date.now() }, schema);
    }
  }

  render() {
    const { navBarButton, isFavorite, hasFavorites } = this.props;

    const type = isFavorite ? 'add-to-favorites-on' : 'add-to-favorites-off';
    const styleName = navBarButton ? 'clear' : 'clear tight';

    if (!hasFavorites) {
      return null;
    }

    return (
      <Button
        styleName={styleName}
        onPress={this.toggleFavorite}
      >
        {this.props.children || <Icon name={type} />}
      </Button>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { schema, item } = ownProps;

  return {
    isFavorite: isFavoriteItem(state, schema, item.id),
    hasFavorites: isFavoritesSchema(state, schema),
  };
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(
    {
      saveFavorite,
      deleteFavorite,
    },
    dispatch,
  )
);

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('Favorite'), undefined, undefined, { virtual: true })(Favorite)
);
