/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState } from 'react';
import { Artifact } from '../types';

interface ArtifactCardProps {
    artifact: Artifact;
    isFocused: boolean;
    onClick: () => void;
}

const ArtifactCard = React.memo(({ 
    artifact, 
    isFocused, 
    onClick 
}: ArtifactCardProps) => {
    const codeRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);

    // Auto-scroll logic for this specific card
    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
    }, [artifact.html]);

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'COPY_CODE' && e.data?.id === artifact.id) {
                navigator.clipboard.writeText(artifact.html).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [artifact.html, artifact.id]);

    const isBlurring = artifact.status === 'streaming';
    
    // Inject right-click listener
    const iframeHtml = artifact.html + `
<script>
window.addEventListener('contextmenu', function(e) {
    if (window.parent) {
        e.preventDefault();
        window.parent.postMessage({ type: 'COPY_CODE', id: '${artifact.id}' }, '*');
    }
});
</script>
`;

    return (
        <div 
            className={`artifact-card ${isFocused ? 'focused' : ''} ${isBlurring ? 'generating' : ''}`}
            onClick={onClick}
            onContextMenu={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(artifact.html).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
            }}
        >
            <div className="artifact-header">
                <span className="artifact-style-tag">{artifact.styleName}</span>
                {copied && <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#4ade80', fontWeight: 500, background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>Zkopírováno!</span>}
            </div>
            <div className="artifact-card-inner">
                {isBlurring && (
                    <div className="generating-overlay">
                        <pre ref={codeRef} className="code-stream-preview">
                            {artifact.html}
                        </pre>
                    </div>
                )}
                <iframe 
                    srcDoc={iframeHtml} 
                    title={artifact.id} 
                    sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin"
                    className="artifact-iframe"
                />
            </div>
        </div>
    );
});

export default ArtifactCard;