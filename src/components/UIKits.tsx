import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import Card from 'antd/lib/card';
import Divider from 'antd/lib/divider';
import Dropdown from 'antd/lib/dropdown';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Menu from 'antd/lib/menu';
import Popconfirm from 'antd/lib/popconfirm';
import Radio from 'antd/lib/radio';
import Tabs from 'antd/lib/tabs';
import Tooltip from 'antd/lib/tooltip';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const { Button: RadioButton, Group: RadioGroup } = Radio;

export {
  Button,
  Col,
  Collapse,
  Image,
  Layout,
  Modal,
  Row,
  Select,
  Slider,
  Space,
  Tag,
  Typography,
  Upload,
} from 'antd';
// upload types
export type { UploadChangeParam, UploadFile, UploadFileStatus } from 'antd/lib/upload/interface';
// custom control
export { ColorPicker, IconSelection, PhotoSelection, UploadImage } from './FormControls';
export {
  ErrorBoundary,
  Input,
  TextArea,
  Form,
  FormItem,
  RadioGroup,
  RadioButton,
  Tabs,
  Tooltip,
  Popconfirm,
  InputNumber,
  Card,
  Divider,
  Menu,
  Dropdown,
};
