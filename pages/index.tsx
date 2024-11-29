
import React from 'react';
import Layout from '../components/common/Layout';
import Link from 'next/link';

const Home: React.FC = () => {
    return (
        <Layout>
            <h1>Welcome to PropMaster AI</h1>
            <nav>
                <ul>
                    <li><Link href="/insights/explorer">Insights Explorer</Link></li>
                    <li><Link href="/trends/analysis">Trend Analysis</Link></li>
                    <li><Link href="/live/gamecenter">Live Game Center</Link></li>
                    <li><Link href="/sentiment/dashboard">Sentiment Dashboard</Link></li>
                    <li><Link href="/builder/customprops">Custom Prop Builder</Link></li>
                    <li><Link href="/analysis/fatigue">Fatigue Analysis</Link></li>
                </ul>
            </nav>
        </Layout>
    );
};

export default Home;
