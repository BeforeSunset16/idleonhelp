import classes from './Header.module.css';

export default function Header() {
  // TypeScript 现在会提示 classes 中可用的类名
  return (
    <header className={classes.header}>
      {/* ✅ 正确：TypeScript 知道 header 类存在 */}
      <nav className={classes.nav}>
        {/* ✅ 正确：TypeScript 知道 nav 类存在 */}
        <div className={classes.logo}>
          {/* Changed invalid class to an existing one */}
          ...
        </div>
      </nav>
    </header>
  );
}
