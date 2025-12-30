import { ShoppingCartIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { JSX } from 'react';

interface CartIconProps {
  cartTotal: number;
  onClick: () => void;
}

const CartIcon = ({ cartTotal, onClick }: CartIconProps): JSX.Element => (
  <button className="relative w-fit cursor-pointer border-none bg-transparent" onClick={onClick}>
    <Avatar className="size-9 rounded-sm">
      <AvatarFallback className="rounded-full">
        <ShoppingCartIcon className="size-5" />
      </AvatarFallback>
    </Avatar>
    {cartTotal > 0 && (
      <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 tabular-nums">
        {cartTotal}
      </Badge>
    )}
  </button>
);

export default CartIcon;
