import { defineComponent } from 'vue'
import { AimOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'

export default defineComponent({
    name: 'MiCaptcha',
    emits: ['success'],
    props: {
        width: PropTypes.number,
        height: PropTypes.number,
        radius: PropTypes.number,
        themeColor: PropTypes.string,
        logo: PropTypes.string,
        text: PropTypes.string,
        background: PropTypes.string,
        image: PropTypes.string,
        getImageAction: PropTypes.string,
        maxTries: PropTypes.number,
        initAction: PropTypes.string,
        verifyAction: PropTypes.string,
        onSuccess: PropTypes.func
    },
    data() {
        return {
            init: false,
            failed: false,
            tip: this.text ? JSON.parse(JSON.stringify(this.text)) : '正在初始化验证码 ......',
            status: {
                ready: true,
                scanning: false,
                being: false,
                success: false
            }
        }
    },
    computed: {
        getThemeStyle() {
            return this.themeColor ? {
                backgroundColor: this.themeColor,
                boxShadow: `inset 0 0 0 1px ${this.themeColor}`
            } : null;
        }
    },
    methods: {
        initCaptcha() {
            this.$http.get(this.initAction ?? this.api.captcha.init).then((res: any) => {
                if (res.ret.code === 1) {
                    this.failed = false
                    this.init = true
                    this.$storage.set(this.$g.caches.storages.captcha.login, res.data.key)
                } else {
                    this.init = false
                    this.failed = true
                    this.tip = '验证码初始化失败，请刷新后再试'
                }
            }).catch(() => {
                this.failed = true
                this.init = false
                this.tip = '初始化接口有误，请稍候再试'
            })
        },
        getPrefixCls() {
            return this.$tools.getPrefixCls('captcha')
        },
        getRadarElem() {
            const prefixCls = this.getPrefixCls()
            const cls = `${prefixCls}-radar${this.status.success ? ` ${prefixCls}-radar-pass` : ''}`
            const style = {
                borderRadius: this.radius ? `${this.radius}px` : null,
                background: this.background
            }
            return (
                <div class={cls} style={style}>
                    { this.getRadarReadyElem() }
                    { this.getRadarScanElem() }
                    { this.getRadarTipElem() }
                    { this.getRadarLogoElem() }
                </div>
            )
        },
        getRadarReadyElem() {
            const prefixCls = this.getPrefixCls()
            return this.status.ready ? (
                <div class={`${prefixCls}-radar-ready`}>
                    <div class={`${prefixCls}-radar-ring`} style={this.getThemeStyle}></div>
                    <div class={`${prefixCls}-radar-dot`} style={this.getThemeStyle} ref={`${prefixCls}-radar-dot`}></div>
                </div>
            ) : null
        },
        getRadarScanElem() {
            const prefixCls = this.getPrefixCls()
            return this.status.scanning ? (
                <div class={`${prefixCls}-radar-scan`}>
                    { () => <AimOutlined /> }
                </div>
            ) : null
        },
        getRadarTipElem() {
            const prefixCls = this.getPrefixCls()
            const cls =  `${prefixCls}-radar-tip${this.failed ? ` ${prefixCls}-radar-tip-error` : ''}`
            return (<div class={cls} innerHTML={this.tip}></div>)
        },
        getRadarLogoElem() {
            const prefixCls = this.getPrefixCls()
            return (
                <div class={`${prefixCls}-radar-logo`}>
                    <a href="https://www.makeit.vip" target="_blank">
                        <img src={this.logo ?? this.$g.avatar} alt={this.$g.powered} />
                    </a>
                </div>
            )
        }
    },
    mounted() {
        this.initCaptcha()
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const cls = `${prefixCls}${this.$g.mobile ? ` ${prefixCls}-mobile` : ''}`
        return (
            <div class={cls}>
                <div class={`${prefixCls}-form`}></div>
                <div class={`${prefixCls}-content`}>
                    { this.getRadarElem() }
                </div>
            </div>
        )
    }
})