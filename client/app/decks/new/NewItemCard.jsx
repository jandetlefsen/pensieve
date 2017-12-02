import React from 'react';
import cx from 'classnames';

import Button from '../../../components/button';

export default function NewItemCard({ item, onInputChange, onRemove, index, className }) {
  return (
    <div className={cx('newItemCard--wrapper', className)}>
      <div className="newItemCard">
        <label>Item {index + 1}</label>
        <Button className="itemCard--close btn-xs" onClick={onRemove}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </Button>
        <div className="form-group">
          <input
            onChange={onInputChange}
            value={item.title}
            name="title"
            className="form-control"
            type="text"
            placeholder="Add an item title..."
          />
        </div>
        <div className="form-group" style={{ flexGrow: '1' }}>
          <textarea
            onChange={onInputChange}
            value={item.description}
            name="description"
            className="form-control"
            type="textarea"
            placeholder="Add an item description..."
          />
        </div>
      </div>
    </div>
  );
}