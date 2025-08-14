import { useEffect, useRef, useState } from 'react';
import { IModel, IFont, IShadow } from '@/types/Subtitle';
import { Upload, Button, Form, InputNumber, message, Select, ColorPicker, Checkbox } from 'antd';
import styles from './index.less'


const SubtitleContainer = () => {
    const [curFont, setCurFont] = useState<IFont>({
        fontFamily: 'ziti1',
        fontSize: 24,
        fontColor: '#000000',
        showShadow: true,
        shadow: {
            color: '#000000',
            offsetX: 0,
            offsetY: 0,
            blur: 0,
        },
        position: 0
    });
    const [showSubTitle, setShowSubTitle] = useState<boolean>(false);
    const [curMaterial, setCurMaterial] = useState<IModel>({});
    const form = Form.useForm();

    return (
        <div className={styles.warpper}>
            <div className={styles.leftContent}>
                <Upload
                    accept='video/*'
                    beforeUpload={(file: any) => {

                        // 判断非视频文件不让上传
                        if (!file.type.includes('video')) {
                            message.error('请上传视频文件');
                            return false;
                        }
                        return true;
                    }}
                    showUploadList={false}
                    customRequest={({ file }: any) => {
                        setShowSubTitle(false);
                        setCurMaterial({});

                        const videoEle = document.createElement('video');
                        videoEle.src = URL.createObjectURL(file);
                        videoEle.addEventListener('loadedmetadata', () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = videoEle.videoWidth;
                            canvas.height = videoEle.videoHeight;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                // 设置视频的播放位置为第二帧
                                videoEle.currentTime = 1; // 假设视频的第二秒
                                videoEle.onseeked = () => {
                                    ctx.drawImage(videoEle, 0, 0, canvas.width, canvas.height);
                                    const secondFrameUrl = canvas.toDataURL('image/png');
                                    setCurMaterial({
                                        id: Math.random().toString(36).substring(2),
                                        type: 'video',
                                        cover: secondFrameUrl,
                                        src: videoEle.src,
                                        duration: videoEle.duration,
                                        width: videoEle.videoWidth,
                                        height: videoEle.videoHeight,
                                    })
                                };
                            }
                        })
                        videoEle.addEventListener('error', () => {
                            message.error('视频加载失败');
                        })
                    }}>
                    <span>上传视频</span>
                </Upload>
                {
                    curMaterial.src &&  !showSubTitle ? (
                        <Button onClick={() => {
                            setShowSubTitle(true);
                        }}>
                            添加字幕
                        </Button>
                    ) : null
                }
                {
                    showSubTitle ? (
                        <Form 
                            initialValues={curFont}
                            onValuesChange={(values: any) => {
                                setCurFont({
                                    ...curFont,
                                    ...values,
                                    ...(values.shadow ? { shadow: { ...curFont.shadow, ...values.shadow } } : {}),
                                })
                            }}>
                            <Form.Item
                                label="字号"
                                name="fontSize"
                                rules={[
                                    { required: true, message: '请输入字号' },
                                    { max: 100, min: 10 }
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                label="字体"
                                name="fontFamily"
                                rules={[{ required: true, message: '请输入字体' }]}
                            >
                                <Select
                                    options={[
                                        {
                                            label: <span style={{ fontFamily: 'ziti1' }}>字体1</span>,
                                            value: 'ziti1',
                                        },
                                        {
                                            label: <span style={{ fontFamily: 'ziti2' }}>字体2</span>,
                                            value: 'ziti2',
                                        },
                                        {
                                            label: <span style={{ fontFamily: 'ziti3' }}>字体3</span>,
                                            value: 'ziti3',
                                        },
                                        {
                                            label: <span style={{ fontFamily: 'ziti4' }}>字体    4</span>,
                                            value: 'ziti4',
                                        },
                                        {
                                            label: <span style={{ fontFamily: 'ziti5' }}>字体    5</span>,
                                            value: 'ziti5',
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="字体颜色"
                                name="fontColor"
                                 getValueFromEvent={(e: any) => e.toHexString()}
                                rules={[{ required: true, message: '请输入字体颜色' }]}
                            >
                                <ColorPicker />
                            </Form.Item>
                            <Form.Item
                                label="阴影"
                                name="shadow"
                            >
                                <RenderSubTitleShadow />
                            </Form.Item>
                            <Form.Item
                                label="位置"
                                name="position"
                            >
                               <InputNumber />
                            </Form.Item>
                        </Form>
                    ) : null
                }
            </div>
            <SubtitleContent 
                curFont={curFont}
                curMaterial={curMaterial}
                showSubTitle={showSubTitle}
                handleCurMaterialUpdate={() => {

                }}
                setCurFont={setCurFont}
            />
        </div>
    );
};

const RenderSubTitleShadow = ({
    value,
    onChange
}: {
    value?: IShadow,
    onChange?: (props: IShadow) => any;
}) => {

    return (
        <div>
            <Form 
                name="shadow"
                initialValues={value}
                onValuesChange={onChange}>
                <Form.Item
                    label="阴影颜色"
                    name="color"
                    getValueFromEvent={(e: any) => e.toHexString()}
                    rules={[{ required: true, message: '请输入阴影颜色' }]}
                >
                    <ColorPicker />
                </Form.Item>
                <Form.Item
                    label="阴影偏移X"
                    name="offsetX"
                    rules={[{ required: true, message: '请输入阴影偏移X' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="阴影偏移Y"
                    name="offsetY"
                    rules={[{ required: true, message: '请输入阴影偏移Y' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="阴影模糊"
                    name="blur"
                    rules={[{ required: true, message: '请输入阴影模糊' }]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </div>
    )
}


const subtitleDragData = {
    isDragging: false,
    offsetX: 0,
    offsetY: 0
}
const SubtitleContent = ({
    curFont,
    curMaterial,
    showSubTitle,
    handleCurMaterialUpdate,
    setCurFont
}: {
    curFont: IFont | null;
    curMaterial: IModel | null;
    showSubTitle: boolean;
    handleCurMaterialUpdate: () => any;
    setCurFont:(props: IFont) => any;
}) => {
    const imageSize = useRef({ 
        realWidth: 1080, 
        realHeight: 1920,
        eleWidth: 0, 
        eleHeight: 0,
        maxMoveY: 0,
        minMoveY: 0,
        containerHeight: 0,
    });
    const [curPositionY, setCurPositionY] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (curFont && imageSize.current.realHeight && (curPositionY !== undefined)) {
            setCurFont({
                ...curFont,
                position: Math.ceil((curPositionY || 0) * imageSize.current.realHeight / imageSize.current.containerHeight),
               ...(imageSize.current.maxMoveY ? {
                    maxMoveY: imageSize.current.realHeight / imageSize.current.containerHeight * imageSize.current.maxMoveY,
                    minMoveY: imageSize.current.realHeight / imageSize.current.containerHeight * imageSize.current.minMoveY
               } : {})
            })
        }
    }, [
        curPositionY, 
        imageSize.current.realHeight,
        imageSize.current.maxMoveY,
        curFont?.fontColor,
        curFont?.fontFamily,
        curFont?.fontSize,
        curFont?.shadow,
        curFont?.showShadow
    ])

    useEffect(() => {
        if (curFont?.position !== undefined && showSubTitle) {
            const subtitleEle = document.getElementById('custom_video_subTitle');      
            if (subtitleEle && imageSize.current.maxMoveY) {
                const subtitleEleRect = subtitleEle.getBoundingClientRect();
                const curTop = Math.min(
                    Math.max(
                        Math.round(curFont.position * imageSize.current.containerHeight / imageSize.current.realHeight),
                        imageSize.current.minMoveY
                    ),
                    imageSize.current.maxMoveY - subtitleEleRect.height
                );
                subtitleEle.style.top = `${curTop}px`;
                subtitleDragData.offsetY = curTop;
            }
        }
    }, [curFont?.position, showSubTitle, imageSize.current])

    useEffect(() => {
        handleCurMaterialUpdate();

        if (curMaterial?.id) {
            const container = document.getElementById('custom_video_subTitle_container');
            const videoCoverEle = document.getElementById('custom_video_cover_container');
            if (videoCoverEle && container) {
                const containerRect = container.getBoundingClientRect();
                let eleWidth = 0, eleHeight = 0;
                const tempData = curMaterial;
                const materialHeight = tempData.height;
                const materialWidth = tempData.width;

                const landscape = materialWidth > materialHeight;

                if (landscape) {
                    // 横屏转竖屏
                    eleWidth = Math.ceil(containerRect.height * imageSize.current.realWidth / imageSize.current.realHeight);
                    eleHeight = Math.ceil(eleWidth * imageSize.current.realWidth / imageSize.current.realHeight);

                    videoCoverEle.style.width = `${eleWidth}px`;
                    videoCoverEle.style.height = 'auto';
                    videoCoverEle.style.backgroundColor = '#000000';
                } else {
                    // 竖屏
                    eleHeight = containerRect.height;
                    eleWidth = Math.ceil(eleHeight * imageSize.current.realWidth / imageSize.current.realHeight);

                    videoCoverEle.style.width = `auto`;
                    videoCoverEle.style.height = `${eleHeight}px`;
                    videoCoverEle.style.backgroundColor = 'transparent';
                }
                imageSize.current = {
                    ...imageSize.current,
                    eleWidth,
                    eleHeight,
                    maxMoveY: containerRect.height - Math.floor((containerRect.height - eleHeight) / 2),
                    minMoveY: Math.ceil((containerRect.height - eleHeight) / 2),
                    containerHeight: containerRect.height
                }
            }
        } else {
            const videoCoverEle = document.getElementById('custom_video_cover_container');
            if (videoCoverEle) {
                videoCoverEle.style.backgroundColor = 'transparent';
            }
        }
    }, [curMaterial?.id])

    useEffect(() => {
        if (curFont && showSubTitle && imageSize.current.realHeight) {
            subtitleDragData.isDragging = false;

            const container = document.getElementById('custom_video_subTitle_container');
            const subtitleEle = document.getElementById('custom_video_subTitle');
            let startX = 0, startY = 0; // 鼠标按下时的初始位置
            
            const handleMousedown =  (e: any) => {
                e.preventDefault(); // 也阻止默认行为，防止意外选中文本
                if (subtitleEle && container) {
                    subtitleDragData.isDragging = true;
                    startX = e.clientX; // 记录鼠标按下时的 X 坐标
                    startY = e.clientY; // 记录鼠标按下时的 Y 坐标
                    subtitleEle.style.cursor = 'grabbing'; // 改变鼠标样式
                }
            };

            const handleMousemove =  (e: any) => {
                if (!subtitleDragData.isDragging || !subtitleEle) return; // 如果没有按下鼠标，不执行拖拽逻辑
            
                // 计算鼠标移动的距离
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // 更新图片的位置
                subtitleDragData.offsetX += deltaX;
                subtitleDragData.offsetY += deltaY;

                // 限制图片在容器内移动
                const subtitleEleRect = subtitleEle.getBoundingClientRect();

                // subtitleDragData.offsetX = Math.ceil(Math.max(subtitleDragData.offsetX, 0)); // 限制左边界
                // subtitleDragData.offsetX =  Math.ceil(Math.min(subtitleDragData.offsetX,containerRect.width - subtitleEleRect.width)); // 限制右边界,
                
                subtitleDragData.offsetY = Math.ceil(Math.max(subtitleDragData.offsetY, imageSize.current.minMoveY)); // 限制上边界
                subtitleDragData.offsetY =  Math.ceil(Math.min(subtitleDragData.offsetY, imageSize.current.maxMoveY - subtitleEleRect.height)); // 限制下边界

                // 应用新的位置
                // subtitleEle.style.left = `${subtitleDragData.offsetX}px`;
                subtitleEle.style.top = `${subtitleDragData.offsetY}px`;

                // 更新鼠标按下时的初始位置
                startX = e.clientX;
                startY = e.clientY;
            }

            const handleMouseup = () => {
                if (subtitleEle) {
                    subtitleDragData.isDragging = false;
                    subtitleEle.style.cursor = 'grab'; // 恢复鼠标样式
                    setCurPositionY(parseFloat(subtitleEle.style.top))
                }
            }
            const handleDragstart = (e: any) => e.preventDefault();

            if (container && subtitleEle) {
                const subtitleEleRect = subtitleEle.getBoundingClientRect();
                subtitleDragData.offsetX = 0;
                subtitleDragData.offsetY = imageSize.current.maxMoveY - subtitleEleRect.height - 8; //距离底部8px
                subtitleEle.style.top = `${subtitleDragData.offsetY}px`; // 更新位置
                setCurPositionY(subtitleDragData.offsetY);

                // 防止默认拖拽行为
                subtitleEle.addEventListener("dragstart", handleDragstart);
                // 鼠标按下事件
                subtitleEle.addEventListener('mousedown', handleMousedown);
                // 鼠标移动事件
                document.addEventListener('mousemove', handleMousemove);
                // 鼠标松开事件
                document.addEventListener('mouseup', handleMouseup);

                handleMouseup();
            }
            return () => {
                if (container && subtitleEle) {
                    subtitleEle.removeEventListener("dragstart", handleDragstart);
                    subtitleEle.removeEventListener('mousedown', handleMousedown);
                    document.removeEventListener('mousemove', handleMousemove);
                    document.removeEventListener('mouseup', handleMouseup);
                }
            }
        }
    }, [curFont && showSubTitle, imageSize.current])

    useEffect(() => {
        if (curFont?.fontSize && imageSize.current.maxMoveY) {
            const subtitleEle = document.getElementById('custom_video_subTitle');
            if (subtitleEle) {
                const subtitleEleRect = subtitleEle.getBoundingClientRect();
                const subtitleEleTop = parseFloat(subtitleEle.style.top);
                if (subtitleEleTop + subtitleEleRect.height > imageSize.current.maxMoveY) {
                    setCurPositionY(imageSize.current.maxMoveY - subtitleEleRect.height);
                }
            }
        }
    }, [curFont?.fontSize, imageSize.current.maxMoveY])

    return (
        <div className={styles.stepTwoVideoWrapper}>
            <div id='custom_video_subTitle_container'>
                <img id={'custom_video_cover_container'}
                    src={ curMaterial?.cover ? curMaterial.cover : '' }
                />
                {
                    curFont && showSubTitle ? (
                        <div id={'custom_video_subTitle'}
                            style={{
                                fontFamily: curFont.fontFamily.split('.')[0],
                                fontSize: Math.max(1, Math.ceil(curFont.fontSize * imageSize.current.containerHeight / 1920)),
                                color: curFont.fontColor,
                                ...(curFont.showShadow ? {
                                    textShadow: `${curFont.shadow.offsetX}px ${curFont.shadow.offsetY}px 0px ${curFont.shadow.color}` 
                                } : {})
                            }}>
                            字幕文案样式
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}

export default SubtitleContainer
