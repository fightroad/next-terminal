import React, {Suspense, useEffect, useState} from 'react';
import {Breadcrumb, Dropdown, Layout, Menu, Modal} from "antd";
import {DesktopOutlined, DownOutlined, LogoutOutlined} from "@ant-design/icons";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {getCurrentUser} from "../service/permission";
import LogoWithName from "../images/logo-with-name.png";
import FooterComponent from "./FooterComponent";
import accountApi from "../api/account";
import {routers} from "./router";
import Landing from "../components/Landing";
import {setTitle} from "../hook/title";

const {Sider, Header} = Layout;

const breadcrumbMatchMap = {
    '/asset/': '资产详情',
    '/user/': '用户详情',
    '/role/': '角色详情',
    '/user-group/': '用户组详情',
    '/login-policy/': '登录策略详情',
    '/command-filter/': '命令过滤器详情',
    '/strategy/': '授权策略详情',
};
const breadcrumbNameMap = {};

routers.forEach(r => {
    if (r.children) {
        r.children.forEach(c => {
            breadcrumbNameMap['/' + c.key] = c.label;
        })
    } else {
        breadcrumbNameMap['/' + r.key] = r.label;
    }
});

const ManagerLayout = () => {

    const location = useLocation();
    const navigate = useNavigate();

    let currentUser = getCurrentUser();

    let userMenus = currentUser['menus'] || [];
    let menus = routers.filter(router => userMenus.includes(router.key)).map(router => {
        if (router.children) {
            router.children = router.children.filter(r => userMenus.includes(r.key));
        }
        return router;
    });
    const menuItems = [...menus, {key: 'logout', icon: <LogoutOutlined/>, label: '退出系统'}];

    let _current = location.pathname.split('/')[1];

    let [current, setCurrent] = useState(_current);
    let [openKeys, setOpenKeys] = useState(JSON.parse(sessionStorage.getItem('openKeys')));

    useEffect(() => {
        setCurrent(_current);
        setTitle(breadcrumbNameMap['/' + _current]);
    }, [_current]);

    const pathSnippets = location.pathname.split('/').filter(i => i);

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        let label = breadcrumbNameMap[url];
        if (!label) {
            for (let k in breadcrumbMatchMap) {
                if (url.includes(k)) {
                    label = breadcrumbMatchMap[k];
                    break;
                }
            }
        }
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{label}</Link>
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">首页</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    const subMenuChange = (openKeys) => {
        setOpenKeys(openKeys);
        sessionStorage.setItem('openKeys', JSON.stringify(openKeys));
    }

    const menu = (
        <Menu>
            <Menu.Item>
                <Link to={'/my-asset'}><DesktopOutlined/> 我的资产</Link>
            </Menu.Item>
            <Menu.Item
                key="logout"
                onClick={() => {
                    Modal.confirm({
                        title: '您确定要退出登录吗?',
                        okText: '确定',
                        cancelText: '取消',
                        centered: true,
                        transitionName: '',
                        maskTransitionName: '',
                        onOk: async () => {
                            await accountApi.logout();
                            navigate('/login');
                        }
                    });
                }}
            >
                <LogoutOutlined/> 退出登录
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="layout" style={{minHeight: '100vh'}}>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="logo">
                    <img src={LogoWithName} alt='logo' width={140}/>
                </div>

                <Menu
                    onClick={(e) => {
                        if (e.key === 'logout') {
                            Modal.confirm({
                                title: '您确定要退出登录吗?',
                                okText: '确定',
                                cancelText: '取消',
                                centered: true,
                                transitionName: '',
                                maskTransitionName: '',
                                onOk: async () => {
                                    await accountApi.logout();
                                    navigate('/login');
                                }
                            });
                            return;
                        }
                        navigate(e.key);
                        setCurrent(e.key);
                    }}
                    selectedKeys={[current]}
                    onOpenChange={subMenuChange}
                    defaultOpenKeys={openKeys}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['']}
                    items={menuItems}
                >
                </Menu>
            </Sider>

            <Layout className="site-layout" style={{marginLeft: 200}}>
                <Header style={{padding: 0, height: 60, zIndex: 20}}>
                    <div className='layout-header'>
                        <div className='layout-header-left'>
                            <Breadcrumb>{breadcrumbItems}</Breadcrumb>
                        </div>

                        <div className='layout-header-right'>
                            <Dropdown overlay={menu}>
                                <div className='nickname layout-header-right-item'>
                                    {getCurrentUser()['nickname']} &nbsp;<DownOutlined/>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

                <Suspense fallback={<div className={'page-container'}><Landing/></div>}>
                    <Outlet/>
                </Suspense>

                <FooterComponent/>
            </Layout>
        </Layout>
    );
}

export default ManagerLayout;