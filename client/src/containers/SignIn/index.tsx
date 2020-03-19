import React from 'react';
import { Form, Button, Alert, Tooltip, Input } from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import './style.css';
import { signIn } from '../../api/signIn';

const SignIn: React.FC = () => {
  const onFinish = ({ email, password }) => {
    signIn({ email, password });
    this.props.history.push('/'); // go to home
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

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
