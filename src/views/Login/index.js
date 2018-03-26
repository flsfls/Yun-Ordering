import React from 'react';
// import { Toast } from 'antd-mobile';
import PropTypes from 'prop-types';
import  { get } from '@util/http'; // eslint-disable-line
import Logo from './assets/bizLogo.jpg';
import { onChange } from '../../util/decoratorMixin'; // eslint-disable-line
import './assets/style.less';

@onChange
class Login extends React.Component {
  state = {
    fsShopName: '', // 商户名
    fsUserId: '', // 用户名
    fsPwd: '', // 密码
  }
  componentDidMount() {
    // will
  }

  login = () => {
    // const isoK = this.state.some(item => item === '');
    // if (isoK) {
    //   Toast.info('请添写用户信息', 1);
    //   return;
    // }
    get('wap/loginWap', { ...this.state }).then(() => {
      this.props.history.replace('/home');
    });
  }

  render() {
    const { fsShopName, fsUserId, fsPwd } = this.state;
    return (
      <div className="login flex_tb_fs_c">
        <img src={Logo} alt="" />
        <input
          placeholder="请输入商户名"
          value={fsShopName}
          onChange={e => this.onChange(e.target.value, 'fsShopName')}
        />
        <input
          placeholder="请输入用户名"
          value={fsUserId}
          onChange={e => this.onChange(e.target.value, 'fsUserId')}
        />
        <input
          placeholder="请输入密码"
          value={fsPwd}
          onChange={e => this.onChange(e.target.value, 'fsPwd')}
        />
        <button onClick={this.login}>登录</button>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Login;
