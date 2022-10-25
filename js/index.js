// 选择形状、绘制工具
// 实现画笔
// 颜色选择、调色板自定义颜色
// 清空画板
// 保存画布

const canvas = document.querySelector('canvas');
// 获取所有的绘图工具
const toolBtns = document.querySelectorAll('.tool');
const fillColor = document.querySelector('#fill-color');
const sizeSlider = document.querySelector('#size-slider');
// 获取所有的颜色按钮
const colorBtns = document.querySelectorAll('.colors .option');
const colorPicker = document.querySelector('#color-picker');

const clearCanvas = document.querySelector('.clear-canvas');
const saveImg = document.querySelector('.save-img');

ctx = canvas.getContext('2d');

// 定义变量用于控制是否可以绘制
let isDrawing = false;
// 定义画笔的宽度，默认宽度
let brushWidth = sizeSlider.value;
// 定义选中的工具，默认为画笔
let selectedTool = 'brush';
let selectedColor = 'black';
// 定义鼠标按下的坐标
let preMouseX, preMouseY, snapshot;

// 为了使下载下来的图片背景与画布canvas背景颜色一致，需要为canvas先指定背景颜色
const setCanvasBgc = () => {
  // 1. 设置背景颜色
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  // 2. 设置完毕后需要将画笔颜色更改为 默认的选中颜色(也可以不设置，在落笔处会设置)
  // ctx.fillStyle = selectedColor;
};

// 为canvas设置宽高,一定要设置为行内样式，否则不生效，而通过js设置的宽高正好是行内样式
window.addEventListener('load', () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  // 页面加载完毕，需要将canvas背景设置为白色（注意是通过绘制为白色的，因此每次清空后，会把背景也清空）
  setCanvasBgc();
});

// 开始绘制函数
const startDraw = e => {
  isDrawing = true;
  ctx.beginPath(); // 每次开始绘制时，都创建新的路径
  ctx.lineWidth = brushWidth; // 设置画笔的宽度
  preMouseX = e.offsetX;
  preMouseY = e.offsetY;
  // console.log(preMouseX, preMouseX);
  // 通过 getImageData() 复制画布上指定矩形的像素数据
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // 设置画笔颜色
  ctx.strokeStyle = selectedColor;
  // 设置填充颜色
  ctx.fillStyle = selectedColor;
};

const drawRect = e => {
  if (!fillColor.checked) {
    // ctx.strokeRec(x, y, width, height) 不填充颜色
    return ctx.strokeRect(preMouseX, preMouseY, e.offsetX - preMouseX, e.offsetY - preMouseY);
  }
  // 填充颜色
  ctx.fillRect(preMouseX, preMouseY, e.offsetX - preMouseX, e.offsetY - preMouseY);
};

const drawCircle = e => {
  ctx.beginPath(); // 每次开始绘制时，都创建新的路径
  // Math.sqrt()开方；Math.pow(底数，几次方)求某数的几次方
  let radius = Math.sqrt(Math.pow(e.offsetX - preMouseX, 2) + Math.pow(e.offsetY - preMouseY, 2));
  ctx.arc(e.offsetX, e.offsetY, radius, 0, 2 * Math.PI);
  // ctx.fill() 填充颜色 ctx.stroke()不填充颜色
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = e => {
  ctx.beginPath();
  ctx.moveTo(preMouseX, preMouseY);
  ctx.lineTo(e.offsetX, e.offsetY); // 第一条边
  ctx.lineTo(preMouseX * 2 - e.offsetX, e.offsetY); // 第二条边
  ctx.closePath(); // 闭合路径（不需要画第三条边）
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
// 正在绘制函数
const drawing = e => {
  // 若 isDrawing 为false，则返回 不绘制
  if (!isDrawing) return;
  // 通过 putImageData() 将图像数据放回画布
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === 'brush' || selectedTool === 'eraser') {
    if (selectedTool === 'eraser') {
      // 设置画笔颜色为白色
      ctx.strokeStyle = '#fff';
    }
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === 'rectangle') {
    drawRect(e);
  } else if (selectedTool === 'circle') {
    drawCircle(e);
  } else if (selectedTool === 'triangle') {
    drawTriangle(e);
  }
};
// 结束绘制函数
const endDraw = () => {
  isDrawing = false;
};

// 选择指定的绘图工具，可以添加active类（从而更换颜色达到选中的效果）
toolBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. 移除所有元素的 active 类：获取拥有active类的元素，移除active
    // elem.classList 获取元素elem的类列表
    document.querySelector('.options .active').classList.remove('active');
    // 2. 再为当前元素添加 active 类
    btn.classList.add('active');
    // 3. 选中当前的绘制工具
    selectedTool = btn.id;
    // console.log(selectedTool);
  });
});

// 设置粗细：监听滑条变化设置画笔粗细
sizeSlider.addEventListener('change', () => {
  brushWidth = sizeSlider.value;
});

// 设置颜色
colorBtns.forEach(color => {
  color.addEventListener('click', () => {
    // 先移除其他所有元素的selected类
    document.querySelector('.colors .selected').classList.remove('selected');
    // 再为当前元素添加 selected 类
    color.classList.add('selected');

    // 设置选中的颜色
    // window.getComputedStyle() 获取的是元素的最终样式（行内、嵌入、外部样式均可读取）; getPropertyValue() 获取指定属性值
    selectedColor = window.getComputedStyle(color).getPropertyValue('background-color');
  });
});

// 自定义颜色
colorPicker.addEventListener('change', () => {
  // parentElement 可以获取其父元素
  colorPicker.parentElement.style.backgroundColor = colorPicker.value;
  // 注意！颜色更换后，父元素一定要调用一下click事件，不然自定义颜色设置不成功，还是上一个颜色
  colorPicker.parentElement.click();
});

// 清空画布
clearCanvas.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 每次清空画布，会把背景清空，因此需要重新设置背景
  setCanvasBgc();
});

// 保存图片
saveImg.addEventListener('click', () => {
  const link = document.createElement('a');
  // canvas.toDataURL(type, encoderOptions)返回一个包含图片展示的数据URL;
  // 参数1 type默认为image / png
  // 参数2 encoderOptions 0到1之间的取值，主要用来选定图片的质量，默认值是0.92
  link.href = canvas.toDataURL();
  link.download = `${Date.now()}.jpg`; // 指定下载文件的名称
  link.click(); // 调用a链接的click点击事件，才可以执行下载
});

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', endDraw);
