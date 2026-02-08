import {useState} from 'react'
import {Card, Button, Stack, Text, useToast} from '@sanity/ui'
import {DownloadIcon} from '@sanity/icons'
import {useClient} from 'sanity'
import {Parser} from 'json2csv'

interface Order {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number }>;
}

interface Product {
  name: string;
  price: number;
  slug?: { current: string };
  isFeatured: boolean;
}

function ExportToolComponent() {
  const client = useClient({apiVersion: '2024-02-05'})
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async (type: 'order' | 'product') => {
    setIsLoading(true)
    try {
      const data = await client.fetch(`*[_type == "${type}"]`)
      
      if (!data || data.length === 0) {
        toast.push({status: 'warning', title: `No ${type}s found`})
        return
      }

      // Flatten data for CSV
      const flattenedData = type === 'order' ? data.map((order: Order) => ({
        OrderNumber: order.orderNumber,
        Date: order.createdAt,
        Customer: order.customerName,
        Email: order.email,
        Phone: order.phone,
        Address: order.address,
        Status: order.status,
        Total: order.totalAmount,
        Items: order.items?.map((i) => `${i.name} (x${i.quantity})`).join('; ')
      })) : data.map((product: Product) => ({
        Name: product.name,
        Price: product.price,
        Slug: product.slug?.current,
        Featured: product.isFeatured
      }))

      const parser = new Parser()
      const csv = parser.parse(flattenedData)
      
      const blob = new Blob([csv], {type: 'text/csv'})
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}s-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      
      toast.push({status: 'success', title: 'Export successful'})
    } catch (err) {
      console.error(err)
      toast.push({status: 'error', title: 'Export failed'})
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card padding={4} height="fill">
      <Stack space={5}>
        <Stack space={3}>
            <Text size={4} weight="bold">Data Export Center</Text>
            <Text size={2} muted>Download your data as CSV files for external analysis or backup.</Text>
        </Stack>
        
        <Stack space={3} style={{maxWidth: '300px'}}>
            <Button 
                icon={DownloadIcon} 
                text="Export Orders (CSV)" 
                onClick={() => handleExport('order')} 
                loading={isLoading}
                tone="primary"
                padding={[3, 3, 4]}
                fontSize={2}
            />
            <Button 
                icon={DownloadIcon} 
                text="Export Products (CSV)" 
                onClick={() => handleExport('product')} 
                loading={isLoading}
                mode="ghost"
                padding={[3, 3, 4]}
                fontSize={2}
            />
        </Stack>
      </Stack>
    </Card>
  )
}

// Wrap in ToastProvider if not already provided (Tools usually have providers, but safe to wrap?)
// Sanity Studio provides ToastContext.
export default ExportToolComponent
