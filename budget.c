#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Define Data Structures
struct Item {
    char name[50];
    float price;
    float importance;
};

struct Family {
    char name[50];
};

// Greedy Selection Function
float greediness(struct Item item, float remaining_budget) {
    // Importance-Price Ratio
    return (item.importance / item.price);
}

// Function to input items from the user
void input_items(struct Item items[], int num_items) {
    for (int i = 0; i < num_items; ++i) {
        printf("Enter name, price, and importance of item %d: ", i + 1);
        scanf("%s %f %f", items[i].name, &items[i].price, &items[i].importance);
    }
}

// Function to input family members from the user
void input_family(struct Family family[], int num_family) {
    for (int i = 0; i < num_family; ++i) {
        printf("Enter name of family member %d: ", i + 1);
        scanf("%s", family[i].name);
    }
}

// Shopping Algorithm
void shop_for_family(struct Item items[], int num_items, struct Family family[], int num_family, float budget) {
    char bought_gifts[50][50];  // Array to track bought gifts (row: family member, column: item name)
    int bought_count = 0;
    float remaining_budget = budget;

    while (remaining_budget > 0 && bought_count < num_family) {
        // Find the greediest item that fits the budget
        struct Item greediest_item;
        int item_index = -1;

        for (int i = 0; i < num_items; ++i) {
            if (strcmp(items[i].name, "") != 0 && items[i].price <= remaining_budget) {
                if (item_index == -1 || greediness(items[i], remaining_budget) > greediness(greediest_item, remaining_budget)) {
                    greediest_item = items[i];
                    item_index = i;
                }
            }
        }

        // If no item fits, break
        if (item_index == -1) {
            break;
        }

        // Buy the item and update remaining budget and bought gifts
        strcpy(bought_gifts[bought_count], greediest_item.name);
        remaining_budget -= greediest_item.price;
        strcpy(items[item_index].name, "");  // Mark item as bought
        bought_count++;
    }

    // Print bought gifts
    for (int i = 0; i < bought_count; ++i) {
        printf("%s bought %s\n", family[i].name, bought_gifts[i]);
    }
}

// Example Usage
int main() {
    int num_gifts, num_family;
    printf("Enter the number of gifts: ");
    scanf("%d", &num_gifts);
    printf("Enter the number of family members: ");
    scanf("%d", &num_family);

    struct Item *gifts = (struct Item *)malloc(num_gifts * sizeof(struct Item));
    struct Family *family_members = (struct Family *)malloc(num_family * sizeof(struct Family));

    input_items(gifts, num_gifts);
    input_family(family_members, num_family);

    float shopping_budget;
    printf("Enter the shopping budget: ");
    scanf("%f", &shopping_budget);

    shop_for_family(gifts, num_gifts, family_members, num_family, shopping_budget);

    free(gifts);
    free(family_members);

    return 0;
}