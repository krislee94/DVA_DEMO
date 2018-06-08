import React, { PropTypes } from 'react';
import { Input } from 'antd';
const Search = Input.Search;

function Header(){
    return (
        <div>
            <Search
                placeholder="input search text"
                onSearch={value => console.log(value)}
                style={{ width: 300 }}
            />
        </div>
    )
}

export default Header;