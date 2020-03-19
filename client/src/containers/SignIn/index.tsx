import React, { useEffect } from 'react';
import { Form, Button, Alert, Tooltip, Input } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './style.css';
import { signIn, isSignIn } from '../../api/signIn';

const SignIn: React.FC<RouteComponentProps> = props => {
  const onEntrance = async () => {
    // 유저가 로그인 창 입장 시 이미 로그인이 되어있으면 바로 Home으로 연결해준다.
    if (await isSignIn()) {
      console.log('이미 로그인됨');
      props.history.push('/'); // go to home
    }
  };

  const onFinish = ({ email, password }) => {
    signIn({ email, password });
    props.history.push('/'); // go to home
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    onEntrance();
  }, []); // ComponentDidMount와 같은 효과로 사용하기 위해 []를 두번째 인자로 사용해야 한다.

  return (
    <div className="text-center align-center">
      <Alert
        message="SignIn"
        type="info"
        className="width-third-center SignIn-normal-item"
      />

      <Tooltip title="Home">
        <Link to="/">
          <Button
            className="SignIn-normal-item"
            type="danger"
            shape="circle"
            icon={<HomeFilled />}
          />
        </Link>
      </Tooltip>

      <br />

      <Form
        className="center"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="User Email"
          name="email"
          rules={[
            {
              type: 'email',
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withRouter(SignIn);
