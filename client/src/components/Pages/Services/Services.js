// Atualização Natal 2024

import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../CartContext/CartContext';
import { fetchProducts } from '../../../api/products';
import { fetchCategories } from '../../../api/categories';
import './Services.css';
import './ServicesResponsive.css';

function groupProductsByCategory(products) {
	const grouped = {};
	products.forEach((prod) => {
		if (Array.isArray(prod.imageUrls) && prod.imageUrls[0]) {
			if (!grouped[prod.category]) grouped[prod.category] = [];
			grouped[prod.category].push(prod);
		}
	});
	return grouped;
}

function Services() {
	const { addToCart } = useContext(CartContext);
	const [addedMsg, setAddedMsg] = useState(false);
	const [carouselIndex, setCarouselIndex] = useState({});
	const [openCategories, setOpenCategories] = useState({});
	const [expandedProduct, setExpandedProduct] = useState(null);
	const [modalImageIndex, setModalImageIndex] = useState(0);
	const [products, setProducts] = useState([]);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const [categoryDescriptions, setCategoryDescriptions] = useState({});

	useEffect(() => {
		fetchProducts().then(setProducts).catch(console.error);
	}, []);

	useEffect(() => {
		fetchCategories()
			.then((data) => {
				const descriptions = {};
				data.forEach((cat) => {
					if (cat.description) descriptions[cat.name] = cat.description;
				});
				setCategoryDescriptions(descriptions);
			})
			.catch(console.error);
	}, []);

	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth <= 768);
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const categories = groupProductsByCategory(products);

	function handleAdd(product) {
		addToCart(product);
		setAddedMsg(true);
		setTimeout(() => setAddedMsg(false), 2000);
	}

	// Scroll infinito para o carrossel de cada categoria
	function nextSlide(categoryId, productsLength) {
		const itemsPerView = 3;
		setCarouselIndex((prev) => {
			const current = prev[categoryId] || 0;
			const maxIndex = Math.max(0, productsLength - itemsPerView);
			return {
				...prev,
				[categoryId]: current >= maxIndex ? 0 : current + 1,
			};
		});
	}

	function prevSlide(categoryId, productsLength) {
		const itemsPerView = 3;
		setCarouselIndex((prev) => {
			const current = prev[categoryId] || 0;
			const maxIndex = Math.max(0, productsLength - itemsPerView);
			return {
				...prev,
				[categoryId]: current <= 0 ? maxIndex : current - 1,
			};
		});
	}

	function toggleCategory(categoryId) {
		setOpenCategories((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId],
		}));
	}

	return (
		<div className="services-container">
			<section className="services-hero">
				<div className="services-hero-content">
					<h1>Nossas Criações Artesanais</h1>
					<p>Conheça cada peça e seu significado</p>
				</div>
			</section>

			<section className="services-categories">
				{Object.entries(categories)
					.filter(([_, products]) => products.length > 0)
					.sort(([categoryA], [categoryB]) => {
						// Coloca "Decoração de Natal" sempre no topo
						if (categoryA === 'Decoração de Natal') return -1;
						if (categoryB === 'Decoração de Natal') return 1;
						// Mantém a ordem alfabética para as demais categorias
						return categoryA.localeCompare(categoryB);
					})
					.map(([categoryName, products]) => {
						const index = carouselIndex[categoryName] || 0;
						const itemsPerView = 3;

						// Use isMobile para decidir o que renderizar
						const visibleProducts = isMobile
							? products
							: products.slice(index, index + itemsPerView);

						const isOpen = openCategories[categoryName];

						const isChristmas = categoryName === 'Decoração de Natal';
						
						return (
							<div key={categoryName} className={`service-category${isChristmas ? ' christmas-category' : ''}`}>
								<button
									className={`category-header dropdown-toggle${
										isOpen ? ' open' : ''
									}${isChristmas ? ' christmas-header' : ''}`}
									onClick={() => toggleCategory(categoryName)}
								>
									<img
										src={categoryName === 'Decoração de Natal' ? '/assets/natal.png' : '/assets/mandalarosa.png'}
										alt=""
										className="mandala-decor"
										aria-hidden="true"
									/>
									<h3 className={isChristmas ? 'christmas-title' : ''}>{categoryName}</h3>
									<span className="dropdown-arrow">
										{isOpen ? '▲' : '▼'}
									</span>
								</button>
								{isOpen && (
									<>
										{categoryDescriptions[categoryName] && (
											<p className="category-desc">
												{categoryDescriptions[categoryName]}
											</p>
										)}
										<div className="carousel-container">
											{!isMobile && products.length > 3 && (
												<button
													className="carousel-button prev"
													onClick={() => prevSlide(categoryName, products.length)}
													disabled={products.length <= itemsPerView}
												>
													&#10094;
												</button>
											)}
											<div
												className={`carousel-track${
													products.length < itemsPerView ? ' center-items' : ''
												}`}
											>
												{visibleProducts.map((product) => (
													<div key={product.id} className="carousel-item">
														<div
															className="product-card"
															onClick={() => {
																setExpandedProduct(product);
																setModalImageIndex(0);
															}}
															style={{ cursor: 'pointer' }}
														>
															<div
																className="product-image-container"
																style={{
																	backgroundImage: product.imageUrls
																		? `url(${product.imageUrls[0]})`
																		: undefined,
																	backgroundSize: 'cover',
																	backgroundPosition: 'center',
																	backgroundRepeat: 'no-repeat',
																	borderRadius: '8px',
																	width: '100%',
																	height: '300px',
																}}
															/>
															<h4>{product.name}</h4>
															<div className="product-card-content">
																<span className="descricao-link">
																	Descrição
																</span>
																<span className="service-price">
																	{typeof product.price === 'number'
																		? `R$ ${Number(product.price).toLocaleString(
																				'pt-BR',
																				{ minimumFractionDigits: 2 }
																		  )}`
																		: product.price}
																</span>
																<button
																	className="add-cart-btn"
																	onClick={e => {
																		e.stopPropagation();
																		handleAdd(product);
																	}}
																>
																	Adicionar ao Carrinho
																</button>
															</div>
														</div>
													</div>
												))}
											</div>
											{!isMobile && products.length > 3 && (
												<button
													className="carousel-button next"
													onClick={() => nextSlide(categoryName, products.length)}
													disabled={products.length <= itemsPerView}
												>
													&#10095;
												</button>
											)}
										</div>
									</>
								)}
							</div>
						);
					})}
			</section>

			{addedMsg && (
				<div className="cart-feedback">Produto adicionado ao carrinho!</div>
			)}

			{expandedProduct && (
				<div
					className="modal-overlay"
					onClick={() => {
						setExpandedProduct(null);
						setModalImageIndex(0);
					}}
				>
					<div className="modal-card" onClick={(e) => e.stopPropagation()}>
						<div
							className="product-image-container"
							style={{
								backgroundImage: expandedProduct.imageUrls
									? `url(${expandedProduct.imageUrls[modalImageIndex]})`
									: undefined,
								backgroundSize: 'contain',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								borderRadius: '8px',
								width: '100%',
								height: '380px',
								marginBottom: '1rem',
								backgroundColor: 'var(--bege-logo)',
							}}
						>
							{expandedProduct.imageUrls &&
								expandedProduct.imageUrls.length > 1 && (
									<>
										<button
											className="modal-arrow left"
											onClick={(e) => {
												e.stopPropagation();
												setModalImageIndex((idx) =>
													idx === 0
														? expandedProduct.imageUrls.length - 1
														: idx - 1
												);
											}}
										>
											&#10094;
										</button>
										<button
											className="modal-arrow right"
											onClick={(e) => {
												e.stopPropagation();
												setModalImageIndex((idx) =>
													idx === expandedProduct.imageUrls.length - 1
														? 0
														: idx + 1
												);
											}}
										>
											&#10095;
										</button>
									</>
								)}
						</div>
						<h3>{expandedProduct.name}</h3>
						<p>{expandedProduct.description}</p>
						<span
							className="measure"
							style={{ alignSelf: 'flex-start', color: 'var(--verde-logo)' }}
						>
							{expandedProduct.measure}
						</span> 
						<span className="service-price">
							{typeof expandedProduct.price === 'number'
								? `R$ ${Number(expandedProduct.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
								: expandedProduct.price}
						</span>
						<button
							className="add-cart-btn"
							onClick={() => handleAdd(expandedProduct)}
						>
							Adicionar ao Carrinho
						</button>
						<button
							className="close-btn"
							onClick={() => {
								setExpandedProduct(null);
								setModalImageIndex(0);
							}}
						>
							Fechar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Services;