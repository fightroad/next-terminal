import React, {useEffect, useState} from 'react';
import {Layout} from "antd";
import {NT_PACKAGE} from "../utils/utils";
import brandingApi from "../api/branding";

const {Footer} = Layout;

let _package = NT_PACKAGE();

const REPO_URL = 'https://github.com/fightroad/next-terminal';
const AUTHOR = 'fightroad';

const FooterComponent = () => {

    let [branding, setBranding] = useState({});

    useEffect(() => {
        const x = async () => {
            let branding = await brandingApi.getBranding();
            document.title = branding['name'];
            setBranding(branding);
        }
        x();
    }, []);

    const renderCopyright = () => {
        const copyright = branding['copyright'] || '';
        const idx = copyright.indexOf(AUTHOR);
        if (idx < 0) {
            return copyright;
        }
        return (
            <>
                {copyright.substring(0, idx)}
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer">{AUTHOR}</a>
                {copyright.substring(idx + AUTHOR.length)}
            </>
        );
    };

    return (
        <Footer style={{textAlign: 'center'}}>
            {renderCopyright()} Version:{_package['version']}
        </Footer>
    );
}

export default FooterComponent;
