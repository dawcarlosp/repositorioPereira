from pathlib import Path
import shutil

root = Path(__file__).resolve().parent.parent

# Directories to rename
folder_map = {
    root / 'src/components/productos': root / 'src/components/products',
    root / 'src/components/vendedor': root / 'src/components/vendors',
    root / 'src/components/ventas': root / 'src/components/sales',
}

# Files to rename
file_map = {
    root / 'src/pages/Dashboard.jsx': root / 'src/pages/DashboardPage.jsx',
    root / 'src/pages/VentasPagina.jsx': root / 'src/pages/SalesPage.jsx',
    root / 'src/pages/VentasPendientesPagina.jsx': root / 'src/pages/PendingSalesPage.jsx',
    root / 'src/pages/VendedoresPendientes.jsx': root / 'src/pages/PendingVendorsPage.jsx',
    root / 'src/pages/GestionProductosPagina.jsx': root / 'src/pages/ProductManagementPage.jsx',
    root / 'src/pages/SobreMiPage.jsx': root / 'src/pages/AboutPage.jsx',
    root / 'src/pages/SobreMi.jsx': root / 'src/pages/AboutPageContent.jsx',
    root / 'src/components/FooterLogin.jsx': root / 'src/components/LoginFooter.jsx',
    root / 'src/components/common/SkeletonTarjetaVendedor.jsx': root / 'src/components/common/SkeletonVendorCard.jsx',
    root / 'src/components/vendors/PendientesList.jsx': root / 'src/components/vendors/PendingVendorList.jsx',
    root / 'src/components/vendors/TarjetaVendedor.jsx': root / 'src/components/vendors/VendorCard.jsx',
    root / 'src/components/vendors/UploadAvatar.jsx': root / 'src/components/vendors/AvatarUploader.jsx',
    root / 'src/components/vendors/Form/FormVendedorRegister.jsx': root / 'src/components/vendors/Form/VendorRegisterForm.jsx',
    root / 'src/components/vendors/Form/FormVendedorLogin.jsx': root / 'src/components/vendors/Form/VendorLoginForm.jsx',
    root / 'src/components/vendors/Form/FormEditarPerfil.jsx': root / 'src/components/vendors/Form/ProfileEditForm.jsx',
    root / 'src/components/products/CatalogoProductos.jsx': root / 'src/components/products/ProductCatalog.jsx',
    root / 'src/components/products/GestionProductos.jsx': root / 'src/components/products/ProductManager.jsx',
    root / 'src/components/products/ModalProductoForm.jsx': root / 'src/components/products/ProductFormModal.jsx',
    root / 'src/components/products/ProductoCard.jsx': root / 'src/components/products/ProductCard.jsx',
    root / 'src/components/products/ProductoSimpleCard.jsx': root / 'src/components/products/ProductSimpleCard.jsx',
    root / 'src/components/products/TablaProductos.jsx': root / 'src/components/products/ProductTable.jsx',
    root / 'src/components/sales/CarritoVentas.jsx': root / 'src/components/sales/SalesCart.jsx',
    root / 'src/components/sales/ContenedorVentas.jsx': root / 'src/components/sales/SalesContainer.jsx',
    root / 'src/components/sales/DrawerCarrito.jsx': root / 'src/components/sales/CartDrawer.jsx',
    root / 'src/components/sales/ModalDetalleVenta.jsx': root / 'src/components/sales/SaleDetailsModal.jsx',
    root / 'src/components/sales/ModalPago.jsx': root / 'src/components/sales/PaymentModal.jsx',
    root / 'src/components/sales/TablaVentas.jsx': root / 'src/components/sales/SalesTable.jsx',
    root / 'src/components/sales/VentaCard.jsx': root / 'src/components/sales/SaleCard.jsx',
    root / 'src/components/sales/VentasNavMenu.jsx': root / 'src/components/sales/SalesNavMenu.jsx',
}

# Rename directories first
for old_dir, new_dir in folder_map.items():
    if old_dir.exists() and not new_dir.exists():
        old_dir.rename(new_dir)

# Rename files
for old_file, new_file in file_map.items():
    if old_file.exists() and not new_file.exists():
        old_file.rename(new_file)

# Update imports/content in JS/JSX files
replacements = [
    ('@components/vendedor/', '@components/vendors/'),
    ('@components/productos/', '@components/products/'),
    ('@components/ventas/', '@components/sales/'),
    ('@pages/VendedoresPendientes', '@pages/PendingVendorsPage'),
    ('@pages/GestionProductosPagina', '@pages/ProductManagementPage'),
    ('@pages/VentasPagina', '@pages/SalesPage'),
    ('@pages/VentasPendientesPagina', '@pages/PendingSalesPage'),
    ('@pages/SobreMiPage', '@pages/AboutPage'),
    ('@pages/Dashboard', '@pages/DashboardPage'),
    ('@components/vendors/Form/FormVendedorRegister', '@components/vendors/Form/VendorRegisterForm'),
    ('@components/vendors/Form/FormVendedorLogin', '@components/vendors/Form/VendorLoginForm'),
    ('@components/vendors/Form/FormEditarPerfil', '@components/vendors/Form/ProfileEditForm'),
    ('@components/vendors/UploadAvatar', '@components/vendors/AvatarUploader'),
    ('@components/products/CatalogoProductos', '@components/products/ProductCatalog'),
    ('@components/products/GestionProductos', '@components/products/ProductManager'),
    ('@components/products/ModalProductoForm', '@components/products/ProductFormModal'),
    ('@components/products/TablaProductos', '@components/products/ProductTable'),
    ('@components/sales/CarritoVentas', '@components/sales/SalesCart'),
    ('@components/sales/ContenedorVentas', '@components/sales/SalesContainer'),
    ('@components/sales/DrawerCarrito', '@components/sales/CartDrawer'),
    ('@components/sales/ModalDetalleVenta', '@components/sales/SaleDetailsModal'),
    ('@components/sales/ModalPago', '@components/sales/PaymentModal'),
    ('@components/sales/TablaVentas', '@components/sales/SalesTable'),
    ('@components/sales/VentaCard', '@components/sales/SaleCard'),
    ('@components/sales/VentasNavMenu', '@components/sales/SalesNavMenu'),
    ('import FormVendedorRegister from', 'import VendorRegisterForm from'),
    ('import FormVendedorLogin from', 'import VendorLoginForm from'),
    ('import FormEditarPerfil from', 'import ProfileEditForm from'),
    ('import UploadAvatar from', 'import AvatarUploader from'),
    ('import CatalogoProductos from', 'import ProductCatalog from'),
    ('import GestionProductos from', 'import ProductManager from'),
    ('import ModalProductoForm from', 'import ProductFormModal from'),
    ('import TablaProductos from', 'import ProductTable from'),
    ('import CarritoVentas from', 'import SalesCart from'),
    ('import ContenedorVentas from', 'import SalesContainer from'),
    ('import DrawerCarrito from', 'import CartDrawer from'),
    ('import ModalDetalleVenta from', 'import SaleDetailsModal from'),
    ('import ModalPago from', 'import PaymentModal from'),
    ('import TablaVentas from', 'import SalesTable from'),
    ('import VentaCard from', 'import SaleCard from'),
    ('import VentasNavMenu from', 'import SalesNavMenu from'),
    ('import PendientesList from', 'import PendingVendorList from'),
    ('import TarjetaVendedor from', 'import VendorCard from'),
    ('import FooterLogin from', 'import LoginFooter from'),
    ('import Dashboard from', 'import DashboardPage from'),
    ('import VentasPagina from', 'import SalesPage from'),
    ('import VentasPendientesPagina from', 'import PendingSalesPage from'),
    ('import VendedoresPendientes from', 'import PendingVendorsPage from'),
    ('import GestionProductosPagina from', 'import ProductManagementPage from'),
    ('import SobreMiPage from', 'import AboutPage from'),
    ('function Dashboard()', 'function DashboardPage()'),
    ('export default function Dashboard', 'export default function DashboardPage'),
    ('export default function VentasPagina', 'export default function SalesPage'),
    ('export default function VentasPendientesPagina', 'export default function PendingSalesPage'),
    ('export default function VendedoresPendientesPagina', 'export default function PendingVendorsPage'),
    ('export default function GestionProductosPagina', 'export default function ProductManagementPage'),
    ('export default function SobreMiPage', 'export default function AboutPage'),
    ('function FormVendedorRegister', 'function VendorRegisterForm'),
    ('function FormVendedorLogin', 'function VendorLoginForm'),
    ('function FormEditarPerfil', 'function ProfileEditForm'),
    ('function CatalogoProductos', 'function ProductCatalog'),
    ('function GestionProductos', 'function ProductManager'),
    ('function ModalProductoForm', 'function ProductFormModal'),
    ('function TablaProductos', 'function ProductTable'),
    ('function CarritoVentas', 'function SalesCart'),
    ('function ContenedorVentas', 'function SalesContainer'),
    ('function DrawerCarrito', 'function CartDrawer'),
    ('function ModalDetalleVenta', 'function SaleDetailsModal'),
    ('function ModalPago', 'function PaymentModal'),
    ('function TablaVentas', 'function SalesTable'),
    ('function VentaCard', 'function SaleCard'),
    ('function VentasNavMenu', 'function SalesNavMenu'),
    ('function PendientesList', 'function PendingVendorList'),
    ('function TarjetaVendedor', 'function VendorCard'),
    ('function FooterLogin', 'function LoginFooter'),
    ('function SobreMi', 'function AboutPageContent'),
]

for path in root.rglob('*'):
    if path.is_file() and path.suffix in {'.js', '.jsx', '.ts', '.tsx'}:
        text = path.read_text(encoding='utf-8')
        new_text = text
        for old, new in replacements:
            new_text = new_text.replace(old, new)
        if new_text != text:
            path.write_text(new_text, encoding='utf-8')

print('Rename and import update script completed')
