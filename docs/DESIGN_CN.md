# 产品方向与当前范围

Surface Studio 是一个曲线驱动的三维建模与实时渲染工作台。目标是把控制点、曲线数学、三维网格和渲染串成一个可操作的产品流程。

## 当前能运行什么

当前是 JavaScript / WebGL 2 产品原型，包含 Bézier / B-spline 轮廓、径向控制点编辑、局部支撑区间显示、旋转壳体、内外壁与端环、相机、简单材质光照、线框、法线和线性深度视图。

采样使用固定精度预设；每次编辑会重建整个网格。曲线表示和局部影响是真实计算，但目前没有局部网格重建优化。材质使用简单光照近似；不是完整 PBR。原生 C++ / OpenGL、工程保存、撤销/重做、对象拾取、后台重建、NURBS 和自适应细分均待实现。

## 第一次演示

1. 用 Python 本地 HTTP 服务打开仓库根目录。
2. 保持 B-spline，选中 P5，调整“径向位置”，观察曲线和壳体变化。
3. 蓝色曲线区间对应所选控制点的局部支撑。移动控制点不会改变区间之外的曲线；这与“只重建局部网格”是不同的概念。
4. 切换 Bézier，观察控制点数量和影响范围变化；阅读源码里的 de Casteljau 插值。
5. 切换线框，改变曲面精度，核对真实顶点和三角形数量。
6. 切换法线和深度，旋转模型观察渲染结果。Z-buffer 检查负责遮挡，不是曲线算法。

## 数学与代码对应

- de Casteljau：重复线性插值求 Bézier 曲线上的点。
- de Boor：用 knot spans 和控制点求 B 样条曲线上的点。
- Cox–de Boor：基函数的递推定义；测试使用它作为独立的 basis-sum 对照。
- 旋转曲面：轮廓半径 r(t) 和高度 y(t)，生成 `(r*cos(theta), y, r*sin(theta))`。
- 法线：从轮廓切向与旋转方向构造，再归一化；内部壁面反向。
- 渲染：CPU vertices/normals/indices → GPU buffers → shader → 深度测试 → framebuffer。

测试从实际原型源码中提取纯曲线函数，检查端点、独立公式对照、局部影响、重复控制点和 Bézier 等价情形；没有复制一份实现冒充测试对象。

## 作品集描述

当前可以描述为：

> Developed a WebGL product prototype for curve-driven 3D modeling, including Bézier/B-spline evaluation, revolved mesh generation and interactive rendering diagnostics.

正式 C++ 项目的描述需要等原生代码实现、运行和验证之后再增加。项目使用合成几何，不包含企业内部交付或客户数据。
